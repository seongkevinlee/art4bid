import React from 'react';

export default class Modal extends React.Component {
  constructor() {
    super();
    this.state = {
      message: '',
      isSent: false
    };
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleModalCancelClick = this.handleModalCancelClick.bind(this);
    this.handleModalSendMessageClick = this.handleModalSendMessageClick.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleDeletePostBtnClick = this.handleDeletePostBtnClick.bind(this);
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

  handleDeletePostBtnClick() {
    const { userId, postId } = this.props;
    const body = {
      userId,
      postId
    };
    fetch('/api/posts/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          this.props.setView('search');
        }, 1000);
        this.setState({
          message: 'The post is successfully deleted.',
          isSent: true
        });
      })
      .catch(err => console.error(err.message));
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
          setTimeout(() => {
            this.handleModalCancelClick();
          }, 1000);
          this.setState({
            message: 'Message is successfully sent.',
            isSent: true
          });
        })
        .catch(err => console.error(err.message));
    }
  }

  render() {
    const { handleMessageChange, handleModalCancelClick, handleModalSendMessageClick, handleDeletePostBtnClick } = this;
    const { message, isSent } = this.state;
    const { mode } = this.props;
    let element = null;
    if (mode === 'message') {
      element = (<div className="modal-content">
        <div className="text-center mt-5 mb-4">
          <textarea
            autoFocus
            rows="4"
            disabled={isSent}
            className={`form-control modal-textarea-custom mx-auto ${isSent ? 'text-center bg-white' : ''}`}
            value={message}
            onChange={handleMessageChange}
            placeholder='type your message' />
        </div>
        <div className="text-center mb-3">
          <div>
            <button
              type="button"
              disabled={isSent}
              className="btn btn-sm mx-2 btn-custom btn-custom-send text-white"
              onClick={handleModalSendMessageClick}>Send</button>
            <button
              type="button"
              disabled={isSent}
              className="btn btn-sm btn-secondary mx-2 btn-custom"
              onClick={handleModalCancelClick}>Cancel</button>
          </div>
        </div>
      </div>);
    } else if (mode === 'deletePost') {
      element = (<div className="modal-content">
        <div className="text-center mt-3 mb-4">
          <p className={`${message ? 'text-secondary' : 'text-dark'} text-center`}>{message || 'Are you sure you want to delete this post?'}</p>
        </div>
        <div className="text-center mb-3">
          <div>
            <button
              type="button"
              disabled={isSent}
              className="btn btn-sm mx-2 btn-custom btn-custom-send text-white"
              onClick={handleDeletePostBtnClick}>Delete</button>
            <button
              type="button"
              disabled={isSent}
              className="btn btn-sm btn-secondary mx-2 btn-custom"
              onClick={handleModalCancelClick}>Cancel</button>
          </div>
        </div>
      </div>);
    }
    return (
      <div className="modal fade-in">
        {element}
      </div>
    );
  }
}
