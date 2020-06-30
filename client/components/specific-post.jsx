import React from 'react';
import PostHeader from './post-header';
import PostBody from './post-body';
import BidHistory from './bid-history';
import Modal from './modal';
import EditPost from './edit-post';

export default class SpecificPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postInfo: null,
      watchlistInfo: null,
      bidInfo: null,
      bidHistory: 'off',
      isModalOpen: false,
      isWatchlisted: false,
      editMode: false
    };
    this.getPostInfo = this.getPostInfo.bind(this);
    this.getWatchlistInfo = this.getWatchlistInfo.bind(this);
    this.getBidInfo = this.getBidInfo.bind(this);
    this.toggleBidHistory = this.toggleBidHistory.bind(this);
    this.messageBtnClick = this.messageBtnClick.bind(this);
    this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
    this.checkIfWatchlisted = this.checkIfWatchlisted.bind(this);
    this.addToWatchlist = this.addToWatchlist.bind(this);
    this.editModeToggle = this.editModeToggle.bind(this);
  }

  componentDidMount() {
    const { postId } = this.props;
    this.getPostInfo(postId);
    this.getWatchlistInfo(postId);
    this.getBidInfo(postId);
    this.checkIfWatchlisted();
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
      });
  }

  getBidInfo(postId) {
    fetch(`/api/bidinfo/${postId}`)
      .then(res => res.json())
      .then(bidInfo => {
        this.setState({ bidInfo });
      });
  }

  toggleBidHistory(bidHistoryView) {
    this.setState({ bidHistory: bidHistoryView });
  }

  messageBtnClick() {
    this.setState({
      isModalOpen: true
    });
  }

  handleModalCloseClick() {
    this.setState({
      isModalOpen: false
    });
  }

  checkIfWatchlisted() {
    fetch(`/api/watchlists/${Number(this.props.postId)}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'successful') {
          return this.setState({ isWatchlisted: true });
        }
      });
  }

  addToWatchlist() {
    fetch(`/api/watchlists/${Number(this.props.postId)}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'inserted') {
          return this.setState({ isWatchlisted: true }, () => this.getWatchlistInfo(this.props.postId));
        } else {
          return this.setState({
            isWatchlisted: false
          }, () => this.getWatchlistInfo(this.props.postId));
        }
      });
  }

  editModeToggle() {
    if (this.state.editMode) {
      this.setState({
        editMode: false
      });
    } else {
      this.setState({
        editMode: true
      });
    }
  }

  renderPost() {
    const {
      postInfo,
      watchlistInfo,
      bidInfo,
      isModalOpen,
      isWatchlisted
    } = this.state;
    const { handleModalCloseClick, messageBtnClick, toggleBidHistory } = this;
    const { userId, postId, setView } = this.props;
    if (postInfo && watchlistInfo && bidInfo) {
      let highestBid;
      if (bidInfo.highestBid === null) {
        highestBid = postInfo.startingBid;
      } else {
        highestBid = bidInfo.highestBid;
      }
      let bodyview;
      if (this.state.bidHistory === 'off') {
        bodyview = (
          <PostBody
            postId={postInfo.postId}
            description={postInfo.description}
            highestBid={highestBid}
            totalBids={bidInfo.totalBids}
            bidEnd={new Date(postInfo.expiredAt).toLocaleString().split(',')[0]}
            userId={userId}
            sellerId={postInfo.sellerId}
            toggleBidHistory={toggleBidHistory}
            messageBtnClick={messageBtnClick}
            getBidInfo={this.getBidInfo}
            editModeToggle = {this.editModeToggle}
          />
        );
      } else if (this.state.bidHistory === 'on') {
        bodyview = (
          <BidHistory
            postId={postId}
            toggleBidHistory={this.toggleBidHistory}
          />
        );
      }
      return (
        <div className="indiv-post">
          <PostHeader
            setView={setView}
            title={postInfo.title}
            userName={postInfo.userName}
            watchlist={watchlistInfo}
            addToWatchlist={this.addToWatchlist}
            isWatchlisted={isWatchlisted}
            getWatchlistInfo={this.getWatchlistInfo}
            postId={postInfo.postId}
            previousView={this.props.previousView}

          />
          <div className="post-image-container">
            <img src={postInfo.imageUrl}></img>
          </div>
          <div>{bodyview}</div>
          <div>
            {isModalOpen ? (
              <Modal
                userId={userId}
                postId={postId}
                recipientId={postInfo.sellerId}
                handleModalCloseClick={handleModalCloseClick}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderEditPost() {
    return (
      <EditPost
        userId={this.props.userId}
        postInfo={this.state.postInfo}
        editModeToggle={this.editModeToggle}
        postId={this.props.postId}
        getPostInfo={this.getPostInfo}/>
    );
  }

  render() {
    if (this.state.editMode === false) {
      return this.renderPost();
    } else {
      return this.renderEditPost();
    }
  }
}
