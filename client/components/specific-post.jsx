import React from 'react';
import Modal from './modal';

export default class SpecificPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileInfo: null,
      isModalOpen: false,
      userId: null,
      postId: null,
      recipientId: null,
      postInfo: null,
      watchlistInfo: null,
      bidInfo: null
    };
    this.getPostInfo = this.getPostInfo.bind(this);
    this.getWatchlistInfo = this.getWatchlistInfo.bind(this);
    this.getBidInfo = this.getBidInfo.bind(this);
    this.handleMessageClick = this.handleMessageClick.bind(this);
    this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
  }

  handleMessageClick() {
    this.setState({
      isModalOpen: true
    });
  }

  handleModalCloseClick() {
    this.setState({
      isModalOpen: false
    });
  }

  componentDidMount() {
    const { postId } = this.props;
    this.getPostInfo(postId);
    this.getWatchlistInfo(postId);
    this.getBidInfo(postId);
  }

  getPostInfo(postId) {
    fetch(`./api/viewpost/${postId}`)
      .then(res => res.json())
      .then(postInfo => {
        this.setState({ postInfo });
      });
  }

  getWatchlistInfo(postId) {
    fetch(`./api/watchlistcounts/${postId}`)
      .then(res => res.json())
      .then(info => {
        const watchlistInfo = info.totalWatchlisters;
        this.setState({ watchlistInfo });
      }
      );
  }

  getBidInfo(postId) {
    fetch(`/api/bidinfo/${postId}`)
      .then(res => res.json())
      .then(bidInfo => {
        this.setState({ bidInfo });
      });
  }

  render() {
    const { handleMessageClick, handleModalCloseClick } = this;
    const { isModalOpen } = this.state;
    // this is for testing
    const recipientId = this.state.recipientId || 2;
    const userId = this.state.userId || 1;
    const postId = this.state.postId || 1;
    const { postInfo, watchlistInfo, bidInfo } = this.state;
    if (postInfo && watchlistInfo && bidInfo) {
      let highestBid;
      if (bidInfo.highestBid === null) {
        highestBid = postInfo.startingBid;
      } else {
        highestBid = bidInfo.highestBid;
      }
      return (
        <div className="indiv-post">
          <header className="post-header text-center d-flex justify-content-between align-items-center pl-3 pr-3">
            <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
              <img
                onClick={() => this.props.setView('search')}
                className="header-icon" src="./images/kindpng.png"></img>
              <p className="following m-0 invisible">go back</p>
            </div>
            <div className="post-header-text">
              <p id="post-name" className="mb-1">&ldquo;{postInfo.title}&rdquo;</p>
              <p id="by" className="mb-1">by</p>
              <p className="m-0">{postInfo.userName}</p>
            </div>
            <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
              <img className="header-icon" src="./images/fire-alt-solid.svg"></img>
              <p className="following mt-2 mb-0"><span>{watchlistInfo}</span> Watching</p>
            </div>
          </header>
          <div className="post-body">
            <div className="post-image-container">
              <img src={postInfo.imageUrl}></img>
            </div>
            <div className="post-description">
              <p className="text-left">{postInfo.description}</p>
            </div>
          </div>
          <div className="post-bid-info d-flex align-items-center justify-content-between">
            <div className="bid-buttons-container d-flex flex-column">
              <input id="bid-offer" type="text" placeholder="$0" />
              <button id="submit-bid" type="button">Submit Bid</button>
              <button id="message" type="button" onClick={handleMessageClick}> Message</button>
            </div>
            <div className="bid-stats p-3">
              <p id="expire-disclaimer" className="text-center">All bids expire at 12AM PST on expiration date</p>
              <div className="bid-numbers d-flex justify-content-between">
                <div className="text-right bid-numbers">
                  <p className="text-right m-0">Highest Bid:</p>
                  <p className="text-right m-0">Total Bids:</p>
                  <p className="text-right m-0">Expires:</p>
                </div>
                <div className="bid-numbers">
                  <p className="m-0">${highestBid}</p>
                  <p className="m-0">{bidInfo.totalBids}</p>
                  <p className="m-0">{new Date(postInfo.expiredAt).toLocaleString().split(',')[0]}</p>
                </div>
              </div>
            </div>
          </div>

          {
            isModalOpen
              ? <Modal
                recipientId={recipientId}
                userId={userId}
                postId={postId}
                handleModalCloseClick={handleModalCloseClick}
              />
              : ('')
          }
        </div>
      );

    } else {
      return (
        <div></div>
      );
    }
  }
}