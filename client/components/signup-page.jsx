import React from 'react';

export default class SignupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      message: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  handleChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  showMessage(message, time) {
    setTimeout(() => {
      this.setState({
        message: ''
      });
    }, time);
    this.setState({
      message: message
    });
  }

  handleSubmit() {
    event.preventDefault();
    const { username, email, password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.showMessage('Passwords don\'t match', 1000);
    } else {
      this.setState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      this.signup(username, email, password);
    }
  }

  handleCancelClick() {
    event.preventDefault();
    this.props.setView('create');
  }

  signup(username, email, password) {
    const user = {
      userName: username,
      email: email,
      password: password
    };
    fetch('/api/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(result => {
        if (result.userId) {
          this.props.setView('search');
          // this needs to be
          this.props.login(result.userName);
        }
        if (result.message && result.message.split(' ')[0] === 'duplicate') {
          this.showMessage('Your username or email is already existed.', 2000);
        }
      });
  }

  render() {
    const { message } = this.state;
    return (
      <div className="background">
        <div className="login">
          <h1 className="signup-logo">ART4BID</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              required
              type="text"
              name="username"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleChange}
              className="border-0"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChange}
              className="border-0"
            />
            <input
              required
              type="password"
              name="password"
              placeholder="password"
              className="border-0"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <input
              required
              type="password"
              name="confirmPassword"
              placeholder="confirm password"
              className="border-0"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
            />
            <button className="btn btn-submit">sign-up</button>
          </form>
        </div>
        <div className={message ? 'signup-msg text-centet' : ''}>
          <p className="my-auto">{message}</p>
        </div>
        <div className="mb-5 cursor-pointer">
          <p onClick={this.handleCancelClick}>cancel</p>
        </div>
      </div>
    );
  }
}
