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
  // console.log(`div-todo div-fade-in ${fadeIn ? 'fade-in' : ''}`);

  useEffect(() => {
    if (delay > 0) {
      setTimeout(() => setFadeIn(true), delay);
    }

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
    // renameTodo(todo.id);
  }

  function handleSubmitRenameTodo() {
    console.log('handleSubmitRenameTodo');
    renameTodo(todo.id);
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
        <div
          className={`todo-label ${
            todo.isCompleted ? 'todo-label-completed' : ''
          }`}
        >
          {todo.description}
        </div>
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
