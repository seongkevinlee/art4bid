import React from 'react';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      loggedIn: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange() {
    this.setState({ value: event.target.value });
  }

  handleSubmit() {
    event.preventDefault();
    alert(this.state.value);

    fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      userName: `${this.state.value}`
    })
      .then(res => res.json())
      .then(data => {
        // eslint-disable-next-line no-console
        console.log(data, 'data');
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h1 className="logo">ART4BID</h1>
          <h2 className="header-title">THIS IS A HEADER TITLE</h2>
          <p>This is a social network art bidding website</p>
          <input
            type="text"
            placeholder="Username"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button className="btn btn-submit">Submit</button>
          <button className="btn btn-cancel">Cancel</button>
        </form>
      </div>
    );
  }
}
