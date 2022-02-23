import React, { useState, useEffect } from 'react';
import { Todo } from '../js/localStorageApi';

export default function TodoListElement({
  todo,
  delay,
  deleteTodo,
  renameTodo,
  checkTodo,
}) {
  // console.log('delay: ' + todo.description, delay);
  // console.log('isFirstCompleted: ' + todo.description, todo.isFirstCompleted);
  // console.log('newAdded: ' + todo.description, todo.newAdded);

  const [fadeIn, setFadeIn] = useState(!delay);
  const [isEdit, setEdit] = useState(false);
  const [todoDesc, setTodoDesc] = useState(todo.description);
  // console.log(`div-todo div-fade-in ${fadeIn ? 'fade-in' : ''}`);

  useEffect(() => {
    if (delay > 0) {
      setTimeout(() => setFadeIn(true), delay);
    }

    // use-effect passiert nach dem Rendern
    todo.newAdded = false;

    return () => {
      // todo cleanup
    };
  }, []);

  function handleDeleteTodo() {
    console.log('handleDeleteTodo');
    deleteTodo(todo.id);
  }

  function handleRenameTodo() {
    console.log('handleRenameTodo');
    setEdit(!isEdit);
  }

  function handleChangeTodo(event) {
    console.log('handleChangeTodo');
    setTodoDesc(event.target.value);
  }

  function handleSubmitRenameTodo(event) {
    console.log('handleSubmitRenameTodo');
    event.preventDefault();

    if (todoDesc.trim().length) {
      renameTodo(todo.id, todoDesc);
      setEdit(false);
    }
  }

  function handleCheckTodo() {
    console.log('handleCheckTodo');
    checkTodo(todo.id);
  }

  return (
    <>
      <div
        className={`div-todo div-fade-in ${
          fadeIn || todo.newAdded ? 'fade-in' : ''
        } ${todo.isFirstCompleted ? 'todo-completed-first' : ''}`}
      >
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={handleCheckTodo}
        />
        {!isEdit && (
          <div
            onClick={handleRenameTodo}
            className={`todo-label ${
              todo.isCompleted ? 'todo-label-completed' : ''
            }`}
          >
            {todo.description}
          </div>
        )}
        {isEdit && (
          <form
            id="formTodo"
            action="#"
            onSubmit={handleSubmitRenameTodo}
            className="todo-label"
          >
            <input
              id="inputNewList"
              name={todo.description}
              placeholder="Beschreibung"
              value={todoDesc}
              onChange={handleChangeTodo}
              required
              minLength={3}
              autoFocus
            ></input>
          </form>
        )}
        <button onClick={handleDeleteTodo}>
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>
        <button onClick={handleRenameTodo}>
          <i className="fa fa-edit" aria-hidden="true"></i>
        </button>
      </div>
    </>
  );
}
