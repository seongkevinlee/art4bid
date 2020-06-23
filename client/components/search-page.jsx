import React from 'react';
import ThumbnailColumn from './thumbnail-column';
import NavBar from './navbar';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paintingThumbnails: [],
      photographThumbnails: [],
      otherThumbnails: []
    };
  }

  render() {
    return (
      <div>
        <row>
          <nav className="text-center mt-3">
            <input className="search-bar text-center w-75 border-0" type="text" name="search" placeholder="search"/>
            {/* <img className="position-relative" src="./images/search-solid.svg"></img> */}
          </nav>
        </row>
        <row className="d-flex mt-4 justify-content-around text-center">
          <div className="column-label">
            <h6>Paintings</h6>
          </div>
          <div className="column-label">
            <h6>Photographs</h6>
          </div>
          <div className="column-label">
            <h6>Other</h6>
          </div>
        </row>
        <row className="d-flex justify-content-around">
          <ThumbnailColumn/>
          <ThumbnailColumn />
          <ThumbnailColumn />
        </row>
        <NavBar/>
      </div>

    );
  }

}
