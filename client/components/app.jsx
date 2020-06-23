import React from 'react';
import LoginPage from './login-page';

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
        <LoginPage/>
      </div>
    );
  }

}
