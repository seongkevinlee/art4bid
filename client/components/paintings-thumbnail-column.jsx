import React from 'react';

export default class PaintingsThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paintings: [],
      paintingOffset: 0,
      buttonDisplay: null
    };
    this.addPaintingThumbnails = this.addPaintingThumbnails.bind(this);
  }

  componentDidMount() {
    this.addPaintingThumbnails();
  }

  addPaintingThumbnails() {
    const offset = this.state.paintingOffset;
    fetch(`./api/posts/paintings/${offset}`)
      .then(res => res.json())
      .then(thumbnailInfo => {
        if (thumbnailInfo.length !== 0) {
          let paintingOffset = this.state.paintingOffset;
          paintingOffset += thumbnailInfo.length;
          this.setState({ paintingOffset });
          const paintingsArr = this.state.paintings.slice().concat(thumbnailInfo);
          this.setState({
            paintings: paintingsArr
          });
          if (this.state.paintings.length < 10) {
            this.setState({ buttonDisplay: 'd-none' });
          }
        } else {
          this.setState({ buttonDisplay: 'd-none' });
        }
      });
  }

  render() {
    const { paintings } = this.state;
    const thumbnails = paintings.map(thumbnail => {
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
            <button type="button" className={`load-button ${this.state.buttonDisplay}`} onClick={this.addPaintingThumbnails}>+</button>
          </div>
        </div>
      );
    });
    return (
      <div className="flex-column thumbnail-column ">
        {thumbnails}
      </div>
    );
  }
}
