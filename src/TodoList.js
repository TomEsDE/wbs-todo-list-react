import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { TodoListApi } from './js/localStorageApi';

export default function TodoList() {
  return (
    <>
      <header className="headerBigContainer">
        <div className="headerContainer">
          <h1 className="welcomeMessage">Welcome to Group 4 Todo List</h1>
        </div>
      </header>
      <Main api={new TodoListApi()} />
      {/* <Main /> */}
      <Footer />
    </>
  );
}
