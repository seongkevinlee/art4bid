import React from 'react';
import Profile from './profile';
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
    let pageBody;
    if (this.state.view === 'search') {
      pageBody = <SearchPage setView = {this.setView}/>;
    }
    if (this.state.view === 'profile') {
      pageBody = <Profile setView = {this.setView}/>;
    }
    return (
      <div>
        {pageBody}
        <NavBar view={this.state.view} setView={this.setView} />
      </div>
    );

  }

}
