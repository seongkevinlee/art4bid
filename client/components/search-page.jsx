import React from 'react';
import ThumbnailColumn from './thumbnail-column';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paintingThumbnails: ['https://i.picsum.photos/id/38/500/500.jpg?hmac=P2ck2JJoFY6U4RS1VwfQve2kzwgG-1D_6PwXf-oi5jo', 'https://i.picsum.photos/id/287/500/500.jpg?hmac=_3noAomaHvNHwr4FpelZX-90Cw1OEmo2ovuVn6bAHKk', 'https://i.picsum.photos/id/255/500/500.jpg?hmac=0_gCBQ2wIYM18DMuuWlnanMpoOuVB7AIPbqsyCSLlKg', 'https://i.picsum.photos/id/238/500/500.jpg?hmac=RTqzA8baxtxXgGxGmalGmNvKeLv_ZYq2GA4PKnmJa_Y', 'https://i.picsum.photos/id/38/500/500.jpg?hmac=P2ck2JJoFY6U4RS1VwfQve2kzwgG-1D_6PwXf-oi5jo', 'https://i.picsum.photos/id/287/500/500.jpg?hmac=_3noAomaHvNHwr4FpelZX-90Cw1OEmo2ovuVn6bAHKk', 'https://i.picsum.photos/id/255/500/500.jpg?hmac=0_gCBQ2wIYM18DMuuWlnanMpoOuVB7AIPbqsyCSLlKg', 'https://i.picsum.photos/id/238/500/500.jpg?hmac=RTqzA8baxtxXgGxGmalGmNvKeLv_ZYq2GA4PKnmJa_Y'],
      photographThumbnails: ['https://i.picsum.photos/id/539/500/500.jpg?hmac=NyE54R8Fm2IqE6Hk3pTEe4DOmo2e_cSgUR8vKTpSofA', 'https://i.picsum.photos/id/658/500/500.jpg?hmac=QNYvBh17etS9gZw_hUNfNg0n_aqI6In00stAX1la6Hs', 'https://i.picsum.photos/id/700/500/500.jpg?hmac=wjNWwfys2n_BG0QY66XIzgzha89OkBDGliKXILUpAG8', 'https://i.picsum.photos/id/1070/500/500.jpg?hmac=fFiEzBh4MVKg9RRd9A3Rdsbvza9QeuqcnNdsKHJzo-8', 'https://i.picsum.photos/id/287/500/500.jpg?hmac=_3noAomaHvNHwr4FpelZX-90Cw1OEmo2ovuVn6bAHKk', 'https://i.picsum.photos/id/255/500/500.jpg?hmac=0_gCBQ2wIYM18DMuuWlnanMpoOuVB7AIPbqsyCSLlKg', 'https://i.picsum.photos/id/238/500/500.jpg?hmac=RTqzA8baxtxXgGxGmalGmNvKeLv_ZYq2GA4PKnmJa_Y'],
      otherThumbnails: ['https://i.picsum.photos/id/803/500/500.jpg?hmac=Y2YcG9jqYgPVY6i0GmAlqVnCDYTYrB-ihVV2bAmKgko', 'https://i.picsum.photos/id/787/500/500.jpg?hmac=O2YdCkSwNnEfSC7ZZlenRggwtQd_93kSrJfdGLHcusg', 'https://i.picsum.photos/id/504/500/500.jpg?hmac=PwnQSrB9KJk3Wugp9rV3Rrf7epLe6a2NuIELWRyZONk', 'https://i.picsum.photos/id/670/500/500.jpg?hmac=N38FiXBMkkVNLkU8iurtSmZLgBc-wDkQJ5yCaCwJrIk', 'https://i.picsum.photos/id/287/500/500.jpg?hmac=_3noAomaHvNHwr4FpelZX-90Cw1OEmo2ovuVn6bAHKk', 'https://i.picsum.photos/id/255/500/500.jpg?hmac=0_gCBQ2wIYM18DMuuWlnanMpoOuVB7AIPbqsyCSLlKg', 'https://i.picsum.photos/id/238/500/500.jpg?hmac=RTqzA8baxtxXgGxGmalGmNvKeLv_ZYq2GA4PKnmJa_Y']
    };
  //   this.getThumbnails() = this.getThumbnails.bind(this);
  }

  // componentDidMount() {
  //   this.getThumbnails(painting)
  //   this.getThumbnails(photograph)
  //   this.getThumbnails(other)
  // }

  // getThumbnails(category) {
  //   fetch('./api/thumbnails')
  //   .then(res => res.json())
  //   .then()
  // }

  render() {
    return (
      <div>
        <div>
          <nav className="text-center mt-3">
            <div className="position-relative">
              <input className="search-bar text-center w-75 border-0 pt-2 pb-2" type="text" name="search" placeholder="search"/>
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
            thumbnails={this.state.paintingThumbnails}/>
          <ThumbnailColumn
            thumbnails={this.state.photographThumbnails}/>
          <ThumbnailColumn
            thumbnails={this.state.otherThumbnails} />
        </div>
      </div>

    );
  }

}
