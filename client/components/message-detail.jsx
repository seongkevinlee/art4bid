import React from 'react';

export default class MessageDetail extends React.Component {
  render() {
    const { getTimeMsg, detailMessages } = this.props;
    return (
      <div>
        {
          detailMessages.map((message, index) => {
            return (
              <div
                key={index}
                className="fadeIn mx-auto message-box">
                <div>
                  <span className="col-3 mt-1 ml-1 message-sender">
                    {message.senderName}
                  </span>
                  <span className="col mt-2 text-right text-secondary message-time">
                    {getTimeMsg(message.createdAt)}
                  </span>
                  <span className="col mr-2 mt-2 text-right text-dark message-date">
                    {new Date(message.createdAt).toLocaleString().split(',')[0] + ' |' + new Date(message.createdAt).toLocaleString().split(',')[1]}
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
    );
  }
}
