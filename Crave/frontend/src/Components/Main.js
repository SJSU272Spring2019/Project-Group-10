import React, { Component } from 'react';
import { Route } from 'react-router-dom'; 
import Home from './Home/Home';
import Menu from './Menu/Menu';
import Cart from './Cart/Cart';

export class Main extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/menu" component={Menu} />
        <Route exact path="/cart" component={Cart} />
      </div>
    )
  }
}

export default Main
