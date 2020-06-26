import React from 'react';

export default class Modal extends React.Component {
  constructor() {
    super();
    this.state = {
      message: ''
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleModalCancelClick = this.handleModalCancelClick.bind(this);
    this.handleModalSendMessageClick = this.handleModalSendMessageClick.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  handleMessageChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      message: event.target.value
    });
  }

  handleModalCancelClick() {
    this.props.handleModalCloseClick();
  }

  handleModalSendMessageClick() {
    this.sendMessage();
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

  sendMessage() {
    const { userId, postId, recipientId } = this.props;
    const { message } = this.state;
    const sendMsg = {
      senderId: userId,
      recipientId: recipientId,
      postId: postId,
      message: message
    };
    if (message.length < 1) {
      this.showMessage('please type your message', 1000);
    } else {
      fetch('/api/message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendMsg)
      })
        .then(res => res.json())
        .then(data => {
          this.showMessage('successfully sent', 1000);
          this.handleModalCancelClick();
        })
        .catch(err => console.error(err.message));
    }
  }

  render() {
    const { handleMessageChange, handleModalCancelClick, handleModalSendMessageClick } = this;
    const { message } = this.state;
    return (
      <div className="modal fade-in">
        <div className="modal-content">
          <div className="text-center mt-5 mb-4">
            <textarea
              autoFocus
              rows="4"
              className="form-control modal-textarea-custom mx-auto"
              value={message}
              onChange={handleMessageChange}
              placeholder='type your message'/>
          </div>
          <div className="text-center mb-3">
            <div>
              <button
                type="button"
                className="btn btn-sm btn-danger mx-2 btn-custom"
                onClick={handleModalSendMessageClick}>Send</button>
              <button
                type="button"
                className="btn btn-sm btn-secondary mx-2 btn-custom"
                onClick={handleModalCancelClick}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
