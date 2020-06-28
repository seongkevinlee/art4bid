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
        <div className='d-flex justify-content-between col-12 mt-1'>
          <div className="my-auto icon-custom">
            {isMessageDetail
              ? (
                <i
                  className="fas fa-chevron-left"
                  onClick={handleBackBtnClick}>
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
        <div>
          <input
            autoFocus
            type="text"
            className="mx-auto fixed-top message-search-input border-0"
            placeholder={`${isMessageDetail ? 'search message' : 'search sender'}`}
            onChange={handleSearchInputChange}
            value={search}
            style={{ display: isSearch ? 'block' : 'none' }} />
        </div>
      </div>
    );
  }
}
