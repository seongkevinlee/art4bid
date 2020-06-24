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
    // COMMENTED OUT CODE IS FOR INFINITE SCROLL LATER ON
    // this.addThumbnails = this.addThumbnails.bind(this);
    // this.paintingOffset = 10;
    // this.photographOffset = 10;
    // this.otherOffset = 10;
  }

  componentDidMount() {
    this.getThumbnails('paintings');
    this.getThumbnails('photographs');
    this.getThumbnails('other');
  }

  getThumbnails(category) {
    fetch(`./api/posts/${category}/0`)
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

  // addThumbnails(category) {
  //   let offset;
  //   switch (category) {
  //     case 'paintings':
  //       offset = this.paintingOffset;
  //       break;
  //     case 'photographs':
  //       offset = this.photographOffset;
  //       break;
  //     case 'other':
  //       offset = this.otherOffset;
  //       break;
  //   }
  //   fetch(`./api/posts/${category}/${offset}`)
  //     .then(res => res.json())
  //     .then(thumbnailInfo => {
  //       if (category === 'paintings') {
  //         this.paintingOffset += 10;
  //         const paintingsArr = this.state.paintings.slice().concat(thumbnailInfo);
  //         this.setState({
  //           paintings: paintingsArr
  //         });
  //       } else if (category === 'photographs') {
  //         this.photographOffset += 10;
  //         const photographsArr = this.state.photographs.slice().concat(thumbnailInfo);
  //         this.setState({
  //           photographs: photographsArr
  //         });
  //       } else if (category === 'other') {
  //         this.otherOffset += 10;
  //         const otherArr = this.state.other.slice().concat(thumbnailInfo);
  //         this.setState({
  //           other: otherArr
  //         });
  //       }
  //     });
  // }

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
              <h6 onClick={() => this.addThumbnails('paintings')} >Other</h6>
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
