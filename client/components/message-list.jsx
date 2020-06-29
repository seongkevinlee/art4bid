import React from 'react';

export default class MessageList extends React.Component {
  render() {
    const { messages, userInfo, handleViewMessageClick, keyword, textBolder } = this.props;
    return (
      <div className='align-items-center message-list-box'>
        <div className='mb-2 mt-1'>
          {messages.length > 0
            ? (
              messages.map((message, index) => {
                const isMe = userInfo.userName === message.senderName;
                let name = null;
                if (keyword) {
                  name = textBolder(`${message.senderName}${isMe ? '(Me)' : ''}`, keyword);
                } else {
                  name = (
                    <>
                      {`${message.senderName}${isMe ? '(Me)' : ''}`}
                    </>
                  );
                }
                return (
                  <div
                    key={index}
                    className={`fadeIn mx-auto ${isMe ? 'message-box-list-me' : 'message-box-list-sender'}`}>
                    <div className="d-flex justify-space-between">
                      <span
                        className="col mt-2 ml-1 message-sender text-left"
                        id={message.senderId + ',' + message.senderName + ',' + message.postId + ',' + message.recipientId}
                        onClick={handleViewMessageClick}>
                        {name}
                      </span>
                      <span className="col mr-2 mt-2 text-right text-dark message-date">
                        {new Date(message.createdAt).toLocaleString().split(',')[0] + ' |' + new Date(message.createdAt).toLocaleString().split(',')[1]}
                      </span>
                    </div>
                    <div>
                      <div className="col text-dark pb-1 message-content">
                        <span
                          className="ml-1 text-left"
                          id={message.senderId + ',' + message.senderName + ',' + message.postId + ',' + message.recipientId}
                          onClick={handleViewMessageClick}>{'postID:' + message.postId}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )
            : (
              <div className='d-flex flex-column align-items-center message-list-box'>
                <div className='d-flex justify-content-between col-12 mb-2 mt-1'>
                  <div className='pt-3 pb-3 mx-auto'>You have no messages.</div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
