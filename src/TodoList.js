import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import { TodoListApi } from './js/localStorageApi';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export default function TodoList() {
  return (
    <>
      <Header />
      <DndProvider backend={HTML5Backend}>
        <Main api={new TodoListApi()} />
      </DndProvider>
      <Footer />
    </>
  );
}
