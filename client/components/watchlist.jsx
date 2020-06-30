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
        <div className='d-flex justify-content-between col-12 mb-2 mt-1'>
          <div
            className='back-container text-center d-flex justify-content-start align-items-center'
          >
            <img
              type='button'
              className="back-arrow"
              src="./images/backarrow.png"
              alt="back-arrow"
              onClick={this.handleClick}
            />
          </div>
          <div className="header-title pt-3 pb-3">
            WATCHLIST
          </div>
          <div className="back-container"></div>
        </div>
        <div className="mt-4">{this.renderPosts()}</div>
      </div>
    );
  }
}
