import React from 'react';

export default class MessageHeader extends React.Component {
  render() {
    const { postId, isMessageDetail, handleBackClick, handleSearchClick } = this.props;
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
        <p className="text-primary postid-custom text-center mb-1">{isMessageDetail ? `postID: ${postId}` : ' '}</p>
      </div>
    );
  }
}
