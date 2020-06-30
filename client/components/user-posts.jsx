import React from 'react';

export default class UserPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postThumbnails: []
    };

    this.getPosts = this.getPosts.bind(this);
    this.renderPosts = this.renderPosts.bind(this);
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    fetch('/api/posts')
      .then(response => response.json())
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
    return <div>{this.renderPosts()}</div>;
  }
}
