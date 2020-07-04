import React from 'react';
import { Spring, config } from 'react-spring/renderprops';

export default class ThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnails: [],
      offsetCounter: 0
    };
    this.container = React.createRef();
    this.addThumbnails = this.addThumbnails.bind(this);
  }

  addContainerListener() {
    this.container.current.addEventListener('scroll', event => { if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) { this.addThumbnails(); } });
  }

  componentDidMount() {
    this.addThumbnails();
    this.addContainerListener();
  }

  addThumbnails() {
    let offset = this.state.offsetCounter;
    fetch(`./api/posts/${this.props.category}/${offset}`)
      .then(res => res.json())
      .then(thumbnailInfo => {
        if (thumbnailInfo.length !== 0) {
          offset += thumbnailInfo.length;
          const thumbnailsArr = this.state.thumbnails.slice().concat(thumbnailInfo);
          this.setState({
            offsetCounter: offset,
            thumbnails: thumbnailsArr
          });
        }
      });
  }

  render() {
    const { thumbnails } = this.state;
    const thumbnailsMap = thumbnails.map(thumbnail => {
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
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={config.molasses}
      >
        {
          props =>
            <div style={props} className="flex-column thumbnail-column" ref={this.container}>
              {thumbnailsMap}
            </div>
        }
      </Spring>
    );
  }
}
