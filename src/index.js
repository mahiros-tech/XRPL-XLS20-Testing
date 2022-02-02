import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import * as xrpl from 'xrpl';   // xrpl.js library

// Define the network client
const xrplClient = new xrpl.Client('wss://s.altnet.rippletest.net:51233');

// Connect to network client before rendering root component
xrplClient.connect()
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <App xrplClient={xrplClient} xrpl={xrpl} />
      </React.StrictMode>,
      document.getElementById('root')
    )
  })
  .catch((error) => {
    console.log(error);
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
