import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoList from './TodoList';
import 'font-awesome/css/font-awesome.min.css';

const h1 = <h1>Hello World</h1>;

ReactDOM.render(
  <React.StrictMode>{<TodoList />}</React.StrictMode>,
  document.getElementById('root')
);
