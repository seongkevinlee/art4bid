import React from 'react';
import ThumbnailColumn from './thumbnail-column';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paintings: [],
      photographs: [],
      other: []
    };
    this.getThumbnails = this.getThumbnails.bind(this);
  }

  componentDidMount() {
    this.getThumbnails('paintings');
    this.getThumbnails('photographs');
    this.getThumbnails('other');
  }

  getThumbnails(category) {
    fetch(`./api/posts/${category}`)
      .then(res => res.json())
      .then(thumbnailInfo => {
        switch (category) {
          case 'paintings':
            this.setState({
              paintings: thumbnailInfo
            });
            break;
          case 'photographs':
            this.setState({
              photographs: thumbnailInfo
            });
            break;
          case 'other':
            this.setState({
              other: thumbnailInfo
            });
            break;
        }
      });
  }

  render() {
    if (this.state.paintings.length > 0 && this.state.photographs.length > 0 && this.state.other.length > 0) {
      return (
        <div>
          <div>
            <nav className="text-center mt-3">
              <div className="position-relative">
                <input className="search-bar text-center w-75 border-0 pt-2 pb-2" type="text" name="search" placeholder="search" />
                <img className="search-mag position-absolute" src="./images/search-solid.svg"></img>
              </div>
            </nav>
          </div>
          <div className="d-flex mt-4 justify-content-around text-center">
            <div className="column-label align-text-bottom">
              <h6>Paintings</h6>
            </div>
            <div className="column-label">
              <h6>Photographs</h6>
            </div>
            <div className="column-label">
              <h6>Other</h6>
            </div>
          </div>
          <div className="d-flex justify-content-around">
            <ThumbnailColumn
              thumbnails={this.state.paintings} />
            <ThumbnailColumn
              thumbnails={this.state.photographs} />
            <ThumbnailColumn
              thumbnails={this.state.other} />
          </div>
        </div>
      );
    } else {
      return <h1>An error occurred</h1>;
    }
  }
}
