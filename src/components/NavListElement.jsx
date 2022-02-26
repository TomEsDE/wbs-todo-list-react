import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';

export default function NavListElement({
  list,
  isActive,
  setActive,
  handleAddList,
  handleRenameList,
  setEdit,
}) {
  // console.log('setActive', setActive);
  const [newListName, setNewListName] = useState('');
  // const [isRename, setRename] = useState(false);

  function handleSetActive() {
    setActive(list.listName);
  }

  function handleSubmitAddList(event) {
    event.preventDefault();

    if (newListName.trim().length) {
      if (list.isNew) handleAddList(newListName);
      else if (list.isEdit) handleRenameList(list.listName, newListName);
    }
    // setRename(false);
    // list.isEdit = false;
  }

  function handleChangeList(event) {
    // console.log('handleChangeTodo', event.target.value);
    setNewListName(event.target.value);
  }

  function handleButtonRenameList(event) {
    console.log('handleRenameList', list.listName);
    setNewListName(list.listName);
    // setRename(!isRename);
    setEdit(list.listName);
    // setNewListName(event.target.value);
  }
  return (
    <>
      <li className="listToDo">
        <button
          className={`list-button ${isActive ? 'list-button-active' : ''}`}
          id="btn_haushalt"
          onClick={handleSetActive}
        >
          {list.isNew || list.isEdit ? (
            <form id="formNewTodo" action="#" onSubmit={handleSubmitAddList}>
              <input
                id="inputNewList"
                name={list.listName}
                placeholder={list.listName}
                value={newListName}
                onChange={handleChangeList}
                required
                minLength={3}
                autoFocus
              ></input>
            </form>
          ) : (
            <span>{list.listName}</span>
          )}
          {!list.isNew && !list.isEdit && (
            <span style={{ fontSize: '8pt', marginLeft: '5px' }}>
              <sub>
                <em>({list.count})</em>
              </sub>
            </span>
          )}
        </button>
        {!list.isNew && (
          <button onClick={handleButtonRenameList}>
            {/* <i className="fa fa-edit" aria-hidden="true"></i> */}
            <FaEdit />
          </button>
        )}
      </li>
    </>
  );
}
