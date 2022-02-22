import React, { useState, useEffect } from 'react';
import { Todo, TodoListApi } from '../js/localStorageApi';

import NavListElement from './NavListElement';
import TodoListElement from './TodoListElement';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   solid,
//   regular,
//   brands,
// } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import st

export default function Main() {
  // const _api = new TodoListApi();
  // console.log(_api.addTodo(_api.createTodo('Einkauf', 'Eier')));

  const [api, setApi] = useState();
  const [lists, setLists] = useState([]);
  const [todos, setTodos] = useState([]);
  const [activeList, setActiveList] = useState('');
  const [newTodo, setNewTodo] = useState('');

  // einmalig ausführen (ohne dependency) -> Api instanziieren
  useEffect(() => {
    console.log('useEffect -> ONCE');
    setApi(new TodoListApi());
  }, []);

  // auf api hören -> alle Listen laden (beim Start)
  useEffect(() => {
    console.log('useEffect -> auf api', api);
    if (api instanceof TodoListApi) {
      setLists(api.getAllLists());
    }
  }, [api]);

  // wenn die Listen geladen sind -> die erste Liste auswählen (beim Start)
  useEffect(() => {
    console.log('useEffect -> auf lists', lists);
    if (api instanceof TodoListApi) {
      setActiveList(lists[0].listName);
    }
  }, [lists]);

  // wenn die aktive Liste gesetzt wird -> Todos der Liste laden!
  useEffect(() => {
    console.log('useEffect -> auf activeList', activeList);
    if (api instanceof TodoListApi) {
      setTodos(api?.getList(activeList));
    }
  }, [activeList]);

  function handleChangeTodo(event) {
    console.log('handleChangeTodo', newTodo);
    setNewTodo(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('handleSubmit', newTodo);
    api.addTodo(api.createTodo(activeList, newTodo));
    setTodos(api?.getList(activeList));
  }

  function deleteTodo(todoId) {
    console.log('deleteTodo', todoId);
    api.removeTodo(todoId);
    setTodos(api?.getList(activeList));
  }

  function renameTodo(todoId) {
    console.log('renameTodo', todoId);
  }

  function checkTodo(todoId) {
    console.log('checkTodo', todoId);
    api.checkTodo(todoId);
    setTodos(api?.getList(activeList));
  }

  function handleAddList(event) {
    console.log('handleAddList');
    if (!lists[0]?.isNew)
      setLists([{ listName: 'Neue Liste', count: 0, isNew: true }, ...lists]);
  }

  return (
    <>
      <div className="flexContainerLists">
        <div id="lists">
          <div className="buttonNewList">
            <div className="labelNewList">Neue Liste</div>
            <button id="buttonAddList" onClick={handleAddList}>
              <i className="fa fa-plus"></i>
            </button>
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
                  />
                );
              })}
            </ul>
          </div>
        </div>
        <div id="todos">
          <div id="addNewToDo">
            <form id="formNewTodo" action="#" onSubmit={handleSubmit}>
              <input
                id="inputNewTodoText"
                type="text"
                name="newTodo"
                value={newTodo}
                onChange={handleChangeTodo}
                placeholder="Add a Todo here... "
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
    </>
  );
}
