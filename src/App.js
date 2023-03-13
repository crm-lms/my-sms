import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
//npm i -D react-router-dom
import './App.css';
import SendMessage from './Components/SendMessage';
import useToken from './Components/useToken';
import Login from "./Components/Login";
import Register from "./Components/Register";

function App() {

  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter basename='my-sms'>
        <Route path='./Components/Login'>
          <Login />
        </Route>
        <Route path='./Components/Register'>
          <Register />
        </Route>
        <Route path="/Components/SendMessage">
          <SendMessage />
        </Route>
      </BrowserRouter>
    </div>
  );
}
export default App;