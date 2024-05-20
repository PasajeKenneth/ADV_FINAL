import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import { AuthProvider } from './AuthContext';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Header />

          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={Home} />
          </Switch>

          <ToastContainer position="top-center" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
