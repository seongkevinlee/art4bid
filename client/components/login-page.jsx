import React from 'react';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
  }

  handleChange() {
    this.setState({ value: event.target.value });
  }

  handleSubmit() {
    event.preventDefault();
    if (!this.state.value) {
      return;
    }
    this.props.userInfo(this.state.value);
  }

  handleSignUpClick() {
    this.props.setView('signup');
  }

  render() {
    return (
      <div className="background">
        <div className="login">
          <h1 className="logo">ART4BID</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="username"
              value={this.state.value}
              onChange={this.handleChange}
              className="border-0"
            />
            <input
              type="password"
              placeholder="password"
              className="border-0"
            />
            <button className="btn btn-submit">sign-in</button>
          </form>
        </div>
        <div>
          <p onClick={this.handleSignUpClick}>sign-up</p>
        </div>
      </div>
    );
  }
}
