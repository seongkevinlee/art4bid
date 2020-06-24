import React from 'react';
import Profile from './profile';
import LoginPage from './login-page';
import SearchPage from './search-page';
import NavBar from './navbar';
import CreatePost from './create-post';
const UserContext = React.createContext('userInfo');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loggedIn: false,
      userInfo: {},
      view: 'search'
    };
    this.setView = this.setView.bind(this);
    this.login = this.login.bind(this);
  }

  setView(currentView) {
    this.setState({ view: currentView });
  }

  componentDidMount() {}

  login(user) {
    fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userName: user })
    })
      .then(res => res.json())
      .then(data => {
        // eslint-disable-next-line no-console
        console.log(data, 'data');
        this.setState(() => {
          return { userInfo: data.userInfo, loggedIn: true };
        });
      });
  }

  render() {
    let pageBody;
    if (this.state.loggedIn === false) {
      return <LoginPage userInfo={this.login} />;
    }
    if (this.state.view === 'search') {
      pageBody = <SearchPage setView={this.setView} />;
    }
    if (this.state.view === 'profile') {
      pageBody = <Profile setView={this.setView} />;
    }
    if (this.state.view === 'create') {
      pageBody = (
        <CreatePost setView={this.setView} userInfo={this.state.userInfo} />
      );
    }
    return (
      <UserContext.Provider value={this.state.userInfo}>
        <div>
          {pageBody}
          <NavBar view={this.state.view} setView={this.setView} />
        </div>
      </UserContext.Provider>
    );
  }
}
