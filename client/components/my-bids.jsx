import React from 'react';
import { Spring } from 'react-spring/renderprops';

export default class MyBids extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postThumbnails: [],
      userId: this.props.userInfo.userId,
      view: ''
    };
    this.getBids = this.getBids.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
    this.setView = this.setView.bind(this);
  }

  setView() {
    this.props.setView('watchlist');
  }

  componentDidMount() {
    this.getBids();
  }

  getBids(props) {
    fetch(`/api/bids/${this.state.userId}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const postIdTracker = [];
        const filteredArr = [];
        for (let i = 0; i < data.length; i++) {
          if (!postIdTracker.includes(data[i].postId)) {
            postIdTracker.push(data[i].postId);
            filteredArr.push(data[i]);
          }
        }
        this.setState({
          postThumbnails: filteredArr
        });
      })
      .catch(err => console.error(err));
  }

  renderPosts() {
    const postThumbnails = [...this.state.postThumbnails];
    if (postThumbnails.length === 0) {
      return <p style={{ marginTop: '50px' }}>You have not made any bids.</p>;
    } else {
      const postThumbnailsGrid = postThumbnails.map(thumbnail => {
        return (
          <img
            alt=""
            key={thumbnail.postId}
            className="user-post-thumbnail col-4 p-0 col-4 cursor-pointer"
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
      <Spring
        from={{ marginRight: -500 }}
        to={{ marginRight: 0 }}
      >
        {
          props =>
            <div className="non-nav" style={props}>
              <div className='my-bids-header d-flex justify-content-between col-12 mb-2 pt-1'>
                <div
                  className='back-container text-center d-flex justify-content-start align-items-center'
                >
                </div>
                <div className='header-title pt-3 pb-3'>MY BIDS</div>
                <button
                  className='mt-1 watchlist-button btn btn-submit-header text-center'
                  onClick={this.setView}>
              WATCH{'\n'}
              LIST
                </button>
              </div>
              <div className="mt-2 watchlist-bids-container">{this.renderPosts()}</div>
            </div>
        }
      </Spring>
    );
  }
}
