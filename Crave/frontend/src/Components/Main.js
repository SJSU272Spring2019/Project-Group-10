import React, { Component } from 'react';
import { Route } from 'react-router-dom'; 
import Header from './Header/Header';
import Home from './Home/Home';

export class Main extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={Header} />
        <Route path="/home" component={Home} />
      </div>
    )
  }
}

export default Main
