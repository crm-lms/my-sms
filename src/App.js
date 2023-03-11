import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
//npm i -D react-router-dom
import './App.css';
import SendMessage from './Components/SendMessage';
import useToken from './Components/useToken';
function App() {
  const { token, setToken } = useToken();
  if(!token) {
    return <SendMessage setToken={setToken} />
  }
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter basename='my-sms'>
          <Route path="/Components/SendMessage">
            <SendMessage />
          </Route>
      </BrowserRouter>
    </div>
  );
}
export default App;