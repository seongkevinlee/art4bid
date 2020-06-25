import React from 'react';

export default class MessageHeader extends React.Component {
  render() {
    const { postId, isMessageDetail, handleBackClick, handleSearchClick } = this.props;
    return (
      <div className='d-flex flex-column align-items-center'>
        <div className='d-flex justify-content-between col-12 mb-2 mt-1'>
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
            <div className='header-title pt-3 mb-1 mx-auto'>MESSAGE</div>
            <p className="text-primary postid-custom">{isMessageDetail ? `postID: ${postId}` : ' '}</p>
          </div>
          <div className="my-auto icon-custom">
            <i
              className="fas fa-search"
              onClick={handleSearchClick}>
            </i>
          </div>
        </div>
      </div>
    );
  }
}
