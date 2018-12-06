import React, { Component } from 'react';
import './App.css';
import LoginForm from './ui/LoginForm';
import Auth from './Auth';
import Home from './ui/Home';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'




const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    Auth.verifyAuth()
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
  )} />
)

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container-fluid">
          <Route path="/" render={() => (
            <Redirect to={{ pathname: '/home' }} />
          )} />
          <Route path="/login" component={LoginForm} />
          <PrivateRoute path='/home' component={Home} />
        </div>
      </Router>
    );
  }
}

export default App;
