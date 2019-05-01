import React, { Component } from 'react';
import axios from 'axios';
import { rootUrl } from '../../config/settings';

export class Home extends Component {

    componentDidMount(){
        axios.get(rootUrl)
        .then((response) => {
            console.log(response.data);
        })
    }

  render() {
    return (
      <div>
        <h5>Menu</h5>
      </div>
    )
  }
}

export default Home
