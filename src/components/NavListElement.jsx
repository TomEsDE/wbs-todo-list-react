import React from 'react';

export default function NavListElement({ list, isActive, setActive }) {
  console.log('setActive', setActive);

  function handleSetActive() {
    setActive(list.listName);
  }
  return (
    <>
      <li className="listToDo">
        <button
          className={`list-button ${isActive ? 'list-button-active' : ''}`}
          id="btn_haushalt"
          onClick={handleSetActive}
        >
          {list.isNew ? (
            <input
              name={list.listName}
              placeholder={list.listName}
              autoFocus
            ></input>
          ) : (
            <span>{list.listName}</span>
          )}
          <span style={{ fontSize: '7pt', marginLeft: '5px' }}>
            <sub>
              <em>({list.count})</em>
            </sub>
          </span>
        </button>
      </li>
    </>
  );
}
