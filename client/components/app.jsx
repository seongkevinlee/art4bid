import React from 'react';
import Profile from './profile';
import LoginPage from './login-page';
import SearchPage from './search-page';
import Message from './message';
import NavBar from './navbar';
import CreatePost from './create-post';
import SpecificPost from './specific-post';
const UserContext = React.createContext('userInfo');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loggedIn: true,
      // change back to false
      userInfo: {},
      view: 'search',
      // change back to create
      postInfo: null
    };
    this.setView = this.setView.bind(this);
    this.login = this.login.bind(this);
    this.getPostInfo = this.getPostInfo.bind(this);
  }

  setView(currentView) {
    this.setState({ view: currentView });
  }

  getPostInfo(postId) {
    this.setState({ postInfo: postId });
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
    const { login, setView, getPostInfo } = this;
    let pageBody;
    if (this.state.loggedIn === false) {
      return <LoginPage userInfo={login} />;
    } else if (this.state.view === 'search') {
      pageBody = <SearchPage setView={setView} getPostInfo={getPostInfo}/>;
    } else if (this.state.view === 'profile') {
      pageBody = <Profile setView={setView} userInfo={this.state.userInfo} />;
    } else if (this.state.view === 'message') {
      pageBody = <Message setView={setView} userInfo={this.state.userInfo} />;
    } else if (this.state.view === 'post') {
      pageBody = <SpecificPost setView ={setView} postId={this.state.postInfo}/>;
    } else if (this.state.view === 'create') {
      pageBody = (
        <CreatePost setView={this.setView} userInfo={this.state.userInfo} />
      );
    }

    return (
      <UserContext.Provider value={this.state.userInfo}>
        <div>
          {pageBody}
          <NavBar view={this.state.view} setView={setView} />
        </div>
      </UserContext.Provider>
    );
  }
}
