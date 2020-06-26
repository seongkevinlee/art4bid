import React from 'react';
import PostHeader from './post-header';
import PostBody from './post-body';
import BidHistory from './bid-history';

export default class SpecificPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postInfo: null,
      watchlistInfo: null,
      bidInfo: null,
      bidHistory: 'off'
    };
    this.getPostInfo = this.getPostInfo.bind(this);
    this.getWatchlistInfo = this.getWatchlistInfo.bind(this);
    this.getBidInfo = this.getBidInfo.bind(this);
    this.toggleBidHistory = this.toggleBidHistory.bind(this);
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

  toggleBidHistory(bidHistoryView) {
    this.setState({ bidHistory: bidHistoryView });
  }

  render() {
    const { postInfo, watchlistInfo, bidInfo } = this.state;
    if (postInfo && watchlistInfo && bidInfo) {
      let highestBid;
      if (bidInfo.highestBid === null) {
        highestBid = postInfo.startingBid;
      } else {
        highestBid = bidInfo.highestBid;
      }
      let bodyview;
      if (this.state.bidHistory === 'off') {
        bodyview = <PostBody
          description={postInfo.description}
          highestBid={highestBid}
          totalBids={bidInfo.totalBids}
          bidEnd={new Date(postInfo.expiredAt).toLocaleString().split(',')[0]}
          userId={this.props.userId}
          sellerId={postInfo.sellerId}
          toggleBidHistory={this.toggleBidHistory}
        />;
      } else if (this.state.bidHistory === 'on') {
        bodyview = <BidHistory
          postId = {this.props.postId}
          toggleBidHistory={this.toggleBidHistory}/>;
      }
      return (
        <div className="indiv-post">
          <PostHeader
            setView={this.props.setView}
            title={postInfo.title}
            userName={postInfo.userName}
            watchlist={watchlistInfo}
          />
          <div className="post-image-container">
            <img src={postInfo.imageUrl}></img>
          </div>
          {bodyview}
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }

  }
}
