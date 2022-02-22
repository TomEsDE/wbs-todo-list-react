import React from 'react';

export default function NavList({ listName, count, isNew, setActive }) {
  // console.log('setActive', setActive);

  function handleSetActive() {
    setActive(listName);
  }
  return (
    <>
      <li className="listToDo">
        <button
          className="list-button list-button-active"
          id="btn_haushalt"
          onClick={handleSetActive}
        >
          {isNew ? (
            <input name={listName} placeholder={listName} autoFocus></input>
          ) : (
            <span>{listName}</span>
          )}
          <span style={{ fontSize: '7pt', marginLeft: '5px' }}>
            <sub>
              <em>({count})</em>
            </sub>
          </span>
        </button>
      </li>
    </>
  );
}
