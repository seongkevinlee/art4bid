import React from 'react';
import EditProfile from './edit-profile';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        {/* <h1 className='logo'>ART4BID</h1>
        <h2 className='header-title'>THIS IS A HEADER TITLE</h2>
        <p>This is a social network art bidding website</p>
        <input type="text" placeholder='Username'/>
        <button className='btn btn-submit'>Submit</button>
        <button className='btn btn-cancel'>Cancel</button> */}
        <EditProfile/>
      </div>
    );
  }

}
