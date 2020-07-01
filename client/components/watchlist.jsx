import React from 'react';

export default class ViewWatchlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postThumbnails: [],
      userId: this.props.userInfo.userId
    };
    this.getPosts = this.getPosts.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.setView('my-bids');
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts(props) {
    fetch(`/api/watchlist/${this.state.userId}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          postThumbnails: data
        });
      })
      .catch(err => console.error(err));
  }

  renderPosts() {
    const postThumbnails = [...this.state.postThumbnails];
    if (postThumbnails.length === 0) {
      return <p style={{ marginTop: '50px' }}>Nothing added to Watchlist.</p>;
    } else {
      const postThumbnailsGrid = postThumbnails.map(thumbnail => {
        return (
          <img
            alt=""
            key={thumbnail.postId}
            className="user-post-thumbnail col-4 p-0 col-4"
            src={thumbnail.imageUrl}
            onClick={() => {
              this.props.getPostInfo(thumbnail.postId);
              this.props.setView('post');
            }}
          />
        );
      });
      return postThumbnailsGrid;
    }
  }

  render() {
    return (
      <div>
        <div className="watchlist-header d-flex justify-content-between col-12 mb-2 pt-1">
          <button
            className="my-bids-btn btn text-center btn-submit-header"
            onClick={this.handleClick}
          >
            MY{'\n'}
            BIDS
          </button>
          <div className="header-title pt-3 pb-3">WATCHLIST</div>
          <div className="back-container"></div>
        </div>
        <div className="mt-2 watchlist-bids-container">
          {this.renderPosts()}
        </div>
      </div>
    );
  }
}
