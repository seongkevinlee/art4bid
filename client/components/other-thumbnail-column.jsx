import React from 'react';

export default class OtherThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      other: [],
      otherOffset: 0,
      buttonDisplay: null
    };
    this.addOtherThumbnails = this.addOtherThumbnails.bind(this);
  }

  componentDidMount() {
    this.addOtherThumbnails();
  }

  addOtherThumbnails() {
    const offset = this.state.otherOffset;
    fetch(`./api/posts/other/${offset}`)
      .then(res => res.json())
      .then(thumbnailInfo => {
        if (thumbnailInfo.length !== 0) {
          let otherOffset = this.state.otherOffset;
          otherOffset += thumbnailInfo.length;
          this.setState({ otherOffset });
          const otherArr = this.state.other.slice().concat(thumbnailInfo);
          this.setState({
            other: otherArr
          });
          if (this.state.other.length <= 10) {
            this.setState({ buttonDisplay: 'd-none' });
          }
        } else {
          this.setState({ buttonDisplay: 'd-none' });
        }
      });
  }

  render() {
    const { other } = this.state;
    const thumbnails = other.map(thumbnail => {
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
            <button type="button" className={`load-button ${this.state.buttonDisplay}`} onClick={this.addOtherThumbnails}>+</button>
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
