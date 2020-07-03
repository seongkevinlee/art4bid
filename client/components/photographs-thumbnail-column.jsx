import React from 'react';

export default class PhotographsThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photographs: [],
      photographOffset: 0
    };
    this.container = React.createRef();
    this.addPhotographThumbnails = this.addPhotographThumbnails.bind(this);
  }

  addContainerListener() {
    this.container.current.addEventListener('scroll', event => { if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight) { this.addPhotographThumbnails(); } });
  }

  componentDidMount() {
    this.addPhotographThumbnails();
    this.addContainerListener();
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
        </div>
      );
    });
    return (
      <div className="flex-column thumbnail-column" ref={this.container}>
        {thumbnails}
      </div>
    );
  }
}
