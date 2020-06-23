import React from 'react';

export default class ThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postThumbnails: []
    };
  }

  componentDidMount() {
    // maybe need to slice the state and concat?
    this.setState({ postThumbnails: this.props.thumbnails });
  }

  render() {
    const thumbnails = this.state.postThumbnails.map((thumbnail, index) => {
      return (
        <img
          key = {index}
          src={thumbnail}
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
