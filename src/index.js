import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <div className="container">
    <p>LEFT CLICK to expose the cell</p>
    <p>RIGHT CLICK to flag the cell when you think it has a mine</p>
    <App />
  </div>, document.getElementById('root'));
registerServiceWorker();
