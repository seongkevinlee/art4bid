import React from 'react';

export default class ThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postThumbnails: this.props.thumbnails
    };
  }

  componentDidMount() {
    // this.setState({
    //   postThumbnails: this.props.thumbnails
    // });
  }

  render() {
    const { postThumbnails } = this.state;
    const thumbnails = postThumbnails.map(thumbnail => {
      return (
        <div key={thumbnail.postId} className="thumbnail-container">
          <img
            alt=""
            key={thumbnail.postId}
            src={thumbnail.imageUrl}
            className="w-100 h-100 fadeIn cover"
            onClick={() => {
              this.props.getPostInfo(thumbnail.postId);
              this.props.setView('post');
            }
            }>
          </img>
        </div>
      );
    });
    return (
      <div className="flex-column thumbnail-column">
        {thumbnails}
      </div>
    );
  }
}
