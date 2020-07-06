import React from 'react';

export default class MessageDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleMessageSend = this.handleMessageSend.bind(this);
    this.showMessage = this.showMessage.bind(this);
  }

  componentDidMount() {
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
    const { message } = this.state;
    this.setState({
      message: ''
    });
    this.props.sendMessage(message);
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

  render() {
    const { message } = this.state;
    const { detailMessages, getTimeMsg, userInfo, keyword, textBolder } = this.props;
    const { handleMessageChange, handleMessageSend } = this;
    return (
      <div ref={element => { this.element = element; }} className="message-detail-box">
        <div>
          {detailMessages.length > 0
            ? (
              detailMessages.map((message, index) => {
                const isMe = message.senderName === userInfo.userName;
                const msgClass = isMe ? 'message-box-me' : 'message-box-sender';
                let newMsg = null;
                if (keyword) {
                  newMsg = textBolder(message.message, keyword);
                } else {
                  newMsg = (
                    <>
                      {message.message}
                    </>
                  );
                }
                return (
                  <div
                    key={index}
                    className={`size-up-down fadeIn ${msgClass}`}>
                    <div className="d-flex justify-space-between">
                      <span className="col-3 mt-2 ml-1 message-sender">
                        {isMe ? 'Me' : message.senderName}
                      </span>
                      <span className="col mt-2 text-right text-secondary message-time">
                        {getTimeMsg(message.createdAt)}
                      </span>
                    </div>
                    <div>
                      <div className="col text-dark mb-1 message-content">
                        <span className="ml-1 text-left">{newMsg}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )
            : ('')
          }
        </div>
        <div className="message-padding"></div>
        <div className="mb-5 fixed-bottom send-message-custom mx-auto">
          <div className="mx-auto">
            <textarea
              autoFocus
              rows="3"
              className="form-control textarea-custom"
              value={message}
              onChange={handleMessageChange}
              placeholder='type your message'
            />
            <button
              className="btn btn-sm btn-danger message-btn-custom"
              onClick={handleMessageSend}>SEND</button>
          </div>
        </div>
      </div>
    );
  }
}
