import React from 'react';

export default class MessageHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      search: ''
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleBackBtnClick = this.handleBackBtnClick.bind(this);
  }

  handleSearchClick() {
    this.setState({
      search: ''
    });
    this.props.searchKeyword('');
    this.props.searchToggle();
  }

  handleSearchInputChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      search: event.target.value.trim()
    });
    this.props.searchKeyword(event.target.value.trim());
  }

  handleBackBtnClick() {
    this.handleSearchClick();
    this.props.handleBackClick();
  }

  render() {
    const {
      postId,
      senderId,
      senderName,
      userInfo,
      isMessageDetail,
      isSearch
    } = this.props;
    const { handleBackBtnClick } = this;
    const { handleSearchClick, handleSearchInputChange } = this;
    const { search } = this.state;
    const displayName = Number(senderId) === Number(userInfo.userId) ? 'Me' : senderName;
    return (
      <div className={`mx-auto message-header fixed-top ${isSearch ? 'bg-light' : 'bg-white'}`}>
        <div className='col-12 mt-1'>
          <div className="my-auto icon-custom-back">
            <i
              style={{ display: isMessageDetail ? 'block' : 'none' }}
              className="fas fa-chevron-left"
              onClick={handleBackBtnClick}>
            </i>
          </div>
          <div className="text-center">
            <div className='header-title pt-2 mx-auto'>MESSAGE</div>
          </div>
          <div className="my-auto icon-custom-search">
            <i
              style={{ display: isSearch ? 'none' : 'block' }}
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
        <div>
          <div style={{ display: isSearch ? 'block' : 'none' }} >
            <input
              autoFocus
              type="text"
              className="mx-auto border-0 fixed-top message-search-input"
              placeholder={`${isMessageDetail ? 'search message' : 'search sender'}`}
              onChange={handleSearchInputChange}
              value={search}
            />
            <div
              className="message-search-input-cancel-btn"
              onClick={handleSearchClick}
            ><i className="fas fa-times"></i></div>
          </div>
        </div>
      </div>
    );
  }
}
