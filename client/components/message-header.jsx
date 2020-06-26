import React from 'react';

export default class MessageHeader extends React.Component {
  render() {
    const {
      postId,
      senderId,
      senderName,
      userInfo,
      isMessageDetail,
      handleBackClick,
      handleSearchClick
    } = this.props;
    const displayName = Number(senderId) === Number(userInfo.userId) ? 'Me' : senderName;
    return (
      <div className='message-header bg-white fixed-top'>
        <div className='d-flex justify-content-between col-12 mt-1'>
          <div className="my-auto icon-custom">
            {isMessageDetail
              ? (
                <i
                  className="fas fa-chevron-left"
                  onClick={handleBackClick}>
                </i>
              )
              : ('')
            }
          </div>
          <div>
            <div className='header-title pt-2 mx-auto'>MESSAGE</div>
          </div>
          <div className="my-auto icon-custom">
            <i
              className="fas fa-search"
              onClick={handleSearchClick}>
            </i>
          </div>
        </div>
        <div>
          {isMessageDetail
            ? (
              <p className="text-primary postid-custom text-center mb-1">{`Sender: ${displayName} | postID: ${postId}`}</p>
            )
            : (
              <p className="text-secondary postid-custom text-center mb-1">{'click message to view details'}</p>
            )
          }
        </div>
      </div>
    );
  }
}
