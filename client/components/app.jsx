import React from 'react';
import LoginPage from './login-page';

const UserContext = React.createContext('userInfo');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      loggedIn: false,
      userInfo: {}
    };
    this.login = this.login.bind(this);
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
    return (
      <div>
        <UserContext.Provider value={this.state.userInfo}>
          <LoginPage userInfo={this.login} />
        </UserContext.Provider>
      </div>
    );
  }
}
