import React from 'react';

export default class MyBids extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postThumbnails: [],
      userId: this.props.userInfo.userId,
      view: ''
    };
    this.getPosts = this.getPosts.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.editModeToggle = this.editModeToggle.bind(this);
    this.renderWatchlist = this.renderWatchlist.bind(this);
  }

  editModeToggle() {
    if (this.state.view === 'my-bids') {
      this.setState({
        view: 'my-bids'
      });
    } else {
      this.setState({
        view: 'watchlist'
      });
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts(props) {
    fetch(`/api/bids/${this.state.userId}`)
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
      return <h4>No posts have been saved...</h4>;
    } else {
      const postThumbnailsGrid = postThumbnails.map(thumbnail => {
        return (
          <img
            key={thumbnail.postId}
            className="user-post-thumbnail col-4 p-0 col-4"
            src={thumbnail.imageUrl}
          />
        );
      });
      return postThumbnailsGrid;
    }
  }

  renderWatchlist() {
    return <h1>WATCHLIST</h1>;
  }

  render() {
    return (
      <div>
        <header className="post-header text-center d-flex justify-content-between align-items-center pl-3 pr-3">
          <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
            <img
              onClick={this.handleClick}
              className="header-icon"
              src="./images/kindpng.png"
            ></img>
          </div>
          <div className="header-title pt-3 pb-3 new-post-header">MY BIDS</div>
          <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
            <button
              className='btn btn-submit-header text-center'
              onClick={this.editModeToggle}
            >
              WATCHLIST
            </button>
          </div>
        </header>
        <div>{this.renderPosts()}</div>
      </div>
    );
  }
}
