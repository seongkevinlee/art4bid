import React from 'react';
import PostHeader from './post-header';
import PostBody from './post-bid';

export default class SpecificPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postInfo: null,
      watchlistInfo: null,
      bidInfo: null
    };
    this.getPostInfo = this.getPostInfo.bind(this);
    this.getWatchlistInfo = this.getWatchlistInfo.bind(this);
    this.getBidInfo = this.getBidInfo.bind(this);
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
          <PostHeader
            setView={this.props.setView}
            title={postInfo.title}
            userName={postInfo.userName}
            watchlist={watchlistInfo}
          />
          <div className="post-body">
            <div className="post-image-container">
              <img src={postInfo.imageUrl}></img>
            </div>
            <div className="post-description">
              <p className="text-left">{postInfo.description}</p>
            </div>
          </div>
          <PostBody
            highestBid = {highestBid}
            totalBids = {bidInfo.totalBids}
            bidEnd={new Date(postInfo.expiredAt).toLocaleString().split(',')[0]}
          />
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }

  }
}
