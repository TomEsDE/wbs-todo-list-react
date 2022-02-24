import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { TodoListApi } from './js/localStorageApi';

export default function TodoList() {
  return (
    <>
      <Header />
      <Main api={new TodoListApi()} />
      <Footer />
    </>
  );
}
