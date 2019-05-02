import React, { Component } from 'react'

export class Header extends Component {
  render() {
    return (
      <div>
        <h1 className="headercomponent">Welcome to Crave</h1>
        {/* <h1 className="headercomponent">{this.props.title}</h1> */}
      </div>
    )
  }
}

export default Header
