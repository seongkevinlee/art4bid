import React from 'react';

export default class ThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postThumbnails: []
    };
  }

  componentDidMount() {
    this.setState({
      postThumbnails: this.props.thumbnails
    });
  }

  render() {
    const thumbnails = this.state.postThumbnails.map(thumbnail => {
      return (
        <img
          key={thumbnail.postId}
          src={thumbnail.imageUrl}
          className="w-100 contain">
        </img>
      );
    });
    return (
      <div className="flex-column thumbnail-column">
        {thumbnails}
      </div>
    );
  }
}
