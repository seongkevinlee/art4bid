import React from 'react';
import { Spring, config } from 'react-spring/renderprops';

export default class OtherThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      other: [],
      otherOffset: 0
    };
    this.container = React.createRef();
    this.addOtherThumbnails = this.addOtherThumbnails.bind(this);
  }

  addContainerListener() {
    this.container.current.addEventListener('scroll', event => { if (event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight) { this.addOtherThumbnails(); } });
  }

  componentDidMount() {
    this.addOtherThumbnails();
    this.addContainerListener();
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
        </div>

      );
    });
    return (
      <Spring
        from = {{ marginRight: -500 }}
        to = {{ marginRight: 0 }}
        config = {config.slow}
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
