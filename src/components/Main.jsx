import React, { useState, useEffect } from 'react';
import { Todo, TodoListApi } from '../js/localStorageApi';
import Modal from 'react-modal';

import NavListElement from './NavListElement';
import TodoListElement from './TodoListElement';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   solid,
//   regular,
//   brands,
// } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import st

export default function Main({ api }) {
  // const _api = new TodoListApi();
  // console.log(_api.addTodo(_api.createTodo('Einkauf', 'Eier')));

  // const [api, setApi] = useState();
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [activeList, setActiveList] = useState('');
  const [newTodo, setNewTodo] = useState('');

  // modal
  const [listDelete, setListDelete] = useState({ todoId: -1, listName: '' });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [dialogTypeConfirm, setDialogTypeConfirm] = useState(false);
  const [dialogConfirmAction, setDialogConfirmAction] = useState();
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('Ein Fehler ist aufgetreten');
  const [dialogHeader, setDialogHeader] = useState('Fehler');

  // auf api hören -> alle Listen laden (beim Start)
  useEffect(() => {
    console.log('useEffect -> auf api', api);
    if (api instanceof TodoListApi) {
      setLists(api.getAllLists());
    }
  }, []);

  // wenn die Listen geladen sind -> z.B. beim Start oder wenn der 'counter' (anzahl todos) upgedatet wird
  useEffect(() => {
    console.log('useEffect -> auf lists', lists);
    if (api instanceof TodoListApi) {
      setActiveList(activeList?.length ? activeList : lists[0]?.listName);
    }
  }, [lists]);

  // wenn die aktive Liste gesetzt wird -> Todos der Liste laden!
  useEffect(() => {
    console.log('useEffect -> auf activeList', activeList);
    if (api instanceof TodoListApi) {
      setTodos(api?.getList(activeList));
    }
  }, [activeList]);

  // wenn die aktive Liste gesetzt wird -> Todos der Liste laden!
  useEffect(() => {
    console.log('useEffect -> auf dialogConfirm', listDelete);
    console.log(' -> dialogConfirm', dialogConfirm);
    if (dialogConfirm) {
      confirmDeleteList();
    }
  }, [dialogConfirm]);

  function handleChangeTodo(event) {
    // console.log('handleChangeTodo', event.target.value);
    setNewTodo(event.target.value);
  }

  function handleSubmitAddTodo(event) {
    event.preventDefault();
    console.log('handleAddTodo', newTodo);

    if (!newTodo.trim().length) {
      return;
    }

    let todoCreated = api.createTodo(activeList, newTodo);
    api.addTodo(todoCreated); // localStorage

    const list = api?.getList(activeList);

    // das neue kennzeichnen, damit es nicht mit 'fade-in' animiert wird
    list.find((listTodo) => listTodo.id === todoCreated.id).newAdded = true;
    setTodos(list);

    // 'zahl' in Navlist updaten
    setLists(api.getAllLists());
    setNewTodo('');
  }

  function confirmDeleteList(todoId, listName) {
    console.log('-------- confirmDeleteList');
    console.table(listDelete);
    closeModal();
    deleteTodo(listDelete.todoId, listDelete.listName, true);
  }

  function deleteTodo(todoId, listName, confirmed = false) {
    console.log('deleteTodo: ', todoId);
    console.log('confirmed: ', confirmed);

    if (api?.getList(listName).length === 1 && !confirmed) {
      setDialogConfirm(false);
      setListDelete(() => ({ todoId: todoId, listName: listName }));
      console.table(listDelete);

      setDialogConfirmAction(() => confirmDeleteList);

      setDialogTypeConfirm(true);
      openModal(`Wollen Sie die Liste wirklich löschen?`, 'Bestätigung');
      return;
    }
    api.removeTodo(todoId);
    setTodos(api?.getList(activeList));

    // 'zahl' in Navlist updaten
    setLists(api.getAllLists());
  }

  function renameTodo(todoId, newDescription) {
    console.log('renameTodo: ', newDescription);
    api.renameTodo(todoId, newDescription);
    setTodos(api?.getList(activeList));
  }

  function checkTodo(todoId) {
    console.log('checkTodo', todoId);
    api.checkTodo(todoId);
    setTodos(api?.getList(activeList));
  }

  function handleRefreshList(event) {
    console.log('handleRefreshList');
    setLists(api.getAllLists());
    setActiveList('');
  }

  function handleAddList(event) {
    console.log('handleAddList');
    if (!lists[0]?.isNew) {
      setActiveList('');
      setLists([{ listName: 'Neue Liste', count: 0, isNew: true }, ...lists]);
    }
  }

  function addList(listName) {
    if (api.addList(listName)) {
      setLists(api.getAllLists());
      setActiveList(listName);
    } else {
      setDialogTypeConfirm(false);
      openModal(
        `Ein Liste mit dem Namen '${listName}' existiert bereits.`,
        'Eingabefehler'
      );
    }
  }

  function renameList(oldListName, newListName) {
    // console.log(`oldListName: ${oldListName} -  newListName: ${newListName}`);
    api.renameList(oldListName, newListName);

    setLists(api.getAllLists());
    setActiveList(newListName);
  }

  // modal functions
  function openModal(dialogMsg, dialogHeader = 'Fehler') {
    setDialogHeader(dialogHeader);
    setDialogMsg(dialogMsg);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#1f8dd6',
    },
  };

  return (
    <main>
      <div className="flexContainerLists">
        <div id="lists">
          <div className="buttonNewList">
            <button id="buttonAddList" onClick={handleRefreshList}>
              <i className="fa fa-refresh"></i>
            </button>
            <div style={{ display: 'flex' }}>
              <div className="labelNewList">Neue Liste</div>
              <button id="buttonAddList" onClick={handleAddList}>
                <i className="fa fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="ul">
            <ul id="elementAddList">
              {lists.map((list) => {
                return (
                  <NavListElement
                    key={list.listName}
                    list={list}
                    isActive={activeList === list.listName}
                    setActive={setActiveList}
                    handleAddList={addList}
                    handleRenameList={renameList}
                  />
                );
              })}
            </ul>
          </div>
        </div>
        <div id="todos">
          <div id="addNewToDo">
            <form id="formNewTodo" action="#" onSubmit={handleSubmitAddTodo}>
              <input
                id="inputNewTodoText"
                type="text"
                name="newTodo"
                value={newTodo}
                onChange={handleChangeTodo}
                placeholder="Add a Todo here... "
                required
                minLength={3}
                autoFocus
              />
              <button type="submit">
                <i className="fa fa-plus"></i>
              </button>
            </form>
          </div>
          <div className="flexContainerToDo">
            <div id="listElement">
              {todos.map((todo, index) => {
                return (
                  <TodoListElement
                    key={todo.id}
                    todo={todo}
                    delay={(index + 1) * 50}
                    deleteTodo={deleteTodo}
                    renameTodo={renameTodo}
                    checkTodo={checkTodo}
                  />
                );
              })}
              {/* <li className="listToDo"></li> */}
            </div>
          </div>
        </div>
      </div>
      {/* Modaler Dialog  */}
      {/* <button onClick={() => openModal('test')}>Open Modal</button> */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
        className="dialog"
      >
        <h2 className="modal-header">{dialogHeader}</h2>
        <div>{dialogMsg}</div>
        <br />
        {!dialogTypeConfirm && <button onClick={closeModal}>Schließen</button>}
        {dialogTypeConfirm && (
          <div className="dialog-buttons">
            <button onClick={closeModal}>Nein</button>
            <button
              onClick={() => {
                setDialogConfirm(true);
                closeModal();
              }}
            >
              Ja
            </button>
          </div>
        )}
      </Modal>
    </main>
  );
}
