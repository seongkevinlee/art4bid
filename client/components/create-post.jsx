import React from 'react';

export default class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: this.props.userInfo };
  }

  handleSubmit() {
    return null;
  }

  render() {
    return (
      <div>
        <form ></form>
      </div>
    );
  }
}
