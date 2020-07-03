import React from 'react';
import { Spring, config } from 'react-spring/renderprops';

export default class PaintingsThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paintings: [],
      paintingOffset: 0
    };
    this.container = React.createRef();
    this.addPaintingThumbnails = this.addPaintingThumbnails.bind(this);
  }

  addContainerListener() {
    this.container.current.addEventListener('scroll', event => { if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) { this.addPaintingThumbnails(); } });
  }

  componentDidMount() {
    this.addPaintingThumbnails();
    this.addContainerListener();
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
        </div>
      );
    });
    return (
      <Spring
        from={{ marginLeft: -500 }}
        to={{ marginLeft: 0 }}
        config={config.slow}
      >
        {
          props =>
            <div style={props} className="flex-column thumbnail-column" ref={this.container}>
              {thumbnails}
            </div>
        }
      </Spring>
    );
  }
}
