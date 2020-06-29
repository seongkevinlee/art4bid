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
      return <h4>No posts to show...</h4>;
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
          <div className="header-title pt-3 pb-3 new-post-header">WATCHLIST</div>
          <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
          </div>
        </header>
        <div>{this.renderPosts()}</div>
      </div>
    );
  }
}
