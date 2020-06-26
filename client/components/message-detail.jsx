import React from 'react';

export default class MessageDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      detailMessages: []
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.viewMessageDetail = this.viewMessageDetail.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  componentDidMount() {
    const { userInfo, senderId, postId } = this.props;
    this.viewMessageDetail(userInfo.userId, senderId, postId);
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  handleMessageChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      message: event.target.value
    });
  }

  handleMessageSend() {
    this.setState({
      message: ''
    });
    this.sendMessage();
  }

  viewMessageDetail(userId, senderId, postId) {
    const body = {
      recipientId: userId,
      senderId: senderId,
      postId: postId
    };
    fetch('/api/message/detail/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(messages => {
        this.setState({
          detailMessages: messages
        });
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

  sendMessage() {
    const { userName, userId } = this.props.userInfo;
    const { message } = this.state;
    const { postId, senderId } = this.props;
    const sendMsg = {
      senderName: userName,
      senderId: userId,
      recipientId: senderId,
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
          this.setState({
            detailMessages: [...this.state.detailMessages, sendMsg]
          });
        })
        .catch(err => console.error(err.message));
    }
  }

  render() {
    const { detailMessages, message } = this.state;
    const { getTimeMsg, userInfo } = this.props;
    const { handleMessageChange, handleMessageSend } = this;
    return (
      <div ref={element => { this.element = element; }} className="message-detail-box">
        <div>
          {
            detailMessages.map((message, index) => {
              const isMe = message.senderName === userInfo.userName;
              const msgClass = isMe ? 'message-box-me' : 'message-box-sender';
              return (
                <div
                  key={index}
                  className={`size-up-down fadeIn ${msgClass}`}>
                  <div>
                    <span className="col-3 mt-2 ml-1 message-sender">
                      {isMe ? 'Me' : message.senderName}
                    </span>
                    <span className="col mt-2 text-right text-secondary message-time">
                      {getTimeMsg(message.createdAt)}
                    </span>
                  </div>
                  <div>
                    <div className="col text-dark mb-1 message-content">
                      <span className="ml-1 text-left">{message.message}</span>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="message-padding"></div>
        <div>
          <div className="input-group mb-5 fixed-bottom mx-auto send-message-custom">
            <textarea
              autoFocus
              rows="3"
              className="form-control textarea-custom"
              value={message}
              onChange={handleMessageChange}
              placeholder='type your message'
            ></textarea>
          </div>
          <div>
            <button
              className="fixed-bottom btn btn-sm btn-danger message-btn-custom"
              onClick={handleMessageSend}>SEND</button>
          </div>
        </div>
      </div>
    );
  }
}
