import React from 'react';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange() {
    this.setState({ value: event.target.value });
  }

  handleSubmit() {
    event.preventDefault();
    this.props.userInfo(this.state.value);
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
