import React from 'react';

export default class PhotographsThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photographs: [],
      photographOffset: 0,
      buttonDisplay: null
    };
    this.addPhotographThumbnails = this.addPhotographThumbnails.bind(this);
  }

  componentDidMount() {
    this.addPhotographThumbnails();
  }

  addPhotographThumbnails() {
    const offset = this.state.photographOffset;
    fetch(`./api/posts/photographs/${offset}`)
      .then(res => res.json())
      .then(thumbnailInfo => {
        if (thumbnailInfo.length !== 0) {
          let photographOffset = this.state.photographOffset;
          photographOffset += thumbnailInfo.length;
          this.setState({ photographOffset });
          const photographsArr = this.state.photographs.slice().concat(thumbnailInfo);
          this.setState({
            photographs: photographsArr
          });
          if (this.state.photographs.length < 10) {
            this.setState({ buttonDisplay: 'd-none' });
          }
        } else {
          this.setState({ buttonDisplay: 'd-none' });
        }
      });
  }

  render() {
    const { photographs } = this.state;
    const thumbnails = photographs.map(thumbnail => {
      return (
        <div key={thumbnail.postId} className="thumbnail-container">
          <img
            alt=""
            key={thumbnail.postId}
            src={thumbnail.imageUrl}
            className="w-100 h-100 fadeIn user-post-thumbnail"
            onClick={() => {
              this.props.getPostInfo(thumbnail.postId);
              this.props.setView('post');
            }
            }>
          </img>
          <div className="mt-1 mb-2">
            <button type="button" className={`load-button ${this.state.buttonDisplay}`} onClick={this.addPhotographThumbnails}>+</button>
          </div>
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
