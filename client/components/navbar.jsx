import React from 'react';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedIcon: null
    };
  }

  render() {
    return (
      <div className="navbar bg-white fixed-bottom p-0">
        <div>
          <img className="nav-icon" src="./images/search-solid.svg"></img>
        </div>
        <div>
          <img className="nav-icon" src="./images/envelope-open-text-solid.svg"></img>
        </div>
        <div>
          <img className="nav-icon" src="./images/plusicon-darkred.png"></img>
        </div>
        <div>
          <img className="nav-icon" src="./images/fire-alt-solid.svg"></img>
        </div>
        <div>
          <img className="nav-icon" src="./images/user-alt-solid.svg"></img>
        </div>
      </div>
    );

  }

}
