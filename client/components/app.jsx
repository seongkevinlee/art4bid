import React from 'react';
import EditProfile from './edit-profile';
import SearchPage from './search-page';
import NavBar from './navbar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      view: 'search'
    };
    this.setView = this.setView.bind(this);
  }

  setView(currentView) {
    this.setState({ view: currentView });
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

  render() {
    let pageBody;
    if (this.state.view === 'search') {
      pageBody = <SearchPage setView = {this.setView}/>;
    } else {
      pageBody = <h1>Hi</h1>;
    }
    return (
      <div>
        {pageBody}
        <NavBar view={this.state.view} setView={this.setView} />
      </div>
    );

  }

}
