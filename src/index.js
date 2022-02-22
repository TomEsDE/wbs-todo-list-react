import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoList from './TodoList';
import 'font-awesome/css/font-awesome.min.css';

ReactDOM.render(
  <React.StrictMode>{<TodoList />}</React.StrictMode>,
  document.getElementById('root')
);
