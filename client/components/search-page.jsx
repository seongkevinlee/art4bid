import React from 'react';
import ThumbnailColumn from './thumbnail-column';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
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

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.getZipcodesByCity = this.getZipcodesByCity.bind(this);
    this.getZipcodesByZipcodeWithinRadius = this.getZipcodesByZipcodeWithinRadius.bind(this);
    this.searchPostsByZipcodes = this.searchPostsByZipcodes.bind(this);
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

  getZipcodesByCity(city, state) {
    const host = 'https://www.zipcodeapi.com/rest/';
    const key = 'js-VdpRhCiVZ9dvq6rnYEmkyzyJ6frYN5RJHQKTtfS8CnnZB130NLTKIBRce8xawVmG';
    const param1 = 'city-zips.json';
    const url = `${host}${key}/${param1}/${city}/${state}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.zip_codes) {
          this.setState({
            search: ''
          });
          this.searchPostsByZipcodes(data.zip_codes);
        } else {
          setTimeout(() => {
            this.setState({
              search: ''
            });
          }, 500);
          this.setState({
            search: 'failed to find data'
          });
        }
      })
      .catch(err => console.error(err.message));
  }

  getZipcodesByZipcodeWithinRadius(zipcode, mile) {
    const host = 'https://www.zipcodeapi.com/rest';
    const key = 'js-VdpRhCiVZ9dvq6rnYEmkyzyJ6frYN5RJHQKTtfS8CnnZB130NLTKIBRce8xawVmG';
    const param1 = 'radius.json';
    const url = `${host}/${key}/${param1}/${zipcode}/${mile}/miles?minimal`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.zip_codes) {
          this.setState({
            search: ''
          });
          this.searchPostsByZipcodes(data.zip_codes);
        } else {
          setTimeout(() => {
            this.setState({
              search: ''
            });
          }, 500);
          this.setState({
            search: 'failed to find data'
          });
        }
      })
      .catch(err => console.error(err.message));
  }

  searchPostsByZipcodes(zipcodes) {
    const paintingArr = [];
    const photographArr = [];
    const otherArr = [];
    if (zipcodes.length > 0) {
      fetch(`/api/post/${zipcodes.join(',')}`)
        .then(res => res.json())
        .then(data => {
          for (const key in data) {
            if (data[key].category === 'paintings') {
              paintingArr.push(data[key]);
            } else if (data[key].category === 'photographs') {
              photographArr.push(data[key]);
            } else if (data[key].category === 'other') {
              otherArr.push(data[key]);
            }
          }
          this.setState({
            paintings: paintingArr,
            photographs: photographArr,
            other: otherArr
          });
        })
        .catch(err => console.error(err.message));
    } else {
      setTimeout(() => {
        this.setState({
          search: ''
        });
      }, 500);
      this.setState({
        search: 'failed to find data'
      });
    }
  }

  handleSearchChange() {
    event.target.value = event.target.value.trim();
    this.setState({
      search: event.target.value
    });
  }

  handleSearchClick() {
    const { search } = this.state;
    if (search.trim().length > 0) {
      if (isNaN(Number(search))) {
        const city = search.split(',')[0].trim().toUpperCase();
        const state = search.split(',')[1] ? search.split(',')[1].trim().toUpperCase() : '';
        // for now, the api doesn't support search by city, we need to receive city and state together
        this.getZipcodesByCity(city, state);
      } else {
      // radius mile is set to 5 as default
        this.getZipcodesByZipcodeWithinRadius(search, 5);
      }
    } else {
      setTimeout(() => {
        this.setState({
          search: ''
        });
      }, 500);
      this.setState({
        search: 'please enter keyword'
      });
    }
  }

  render() {
    const { handleSearchChange, handleSearchClick } = this;
    const { search, paintings, photographs, other } = this.state;
    if (paintings.length >= 0 && photographs.length >= 0 && other.length >= 0) {
      return (
        <div>
          <div>
            <nav className="text-center mt-3">
              <div className="position-relative">
                <input
                  autoFocus
                  id="search"
                  className="search-bar text-center w-75 border-0 pt-2 pb-2"
                  type="text"
                  name="search"
                  placeholder="search"
                  value={search}
                  onChange={handleSearchChange} />
                <img
                  className="search-mag position-absolute"
                  src="./images/search-solid.svg"
                  onClick={handleSearchClick}></img>
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
            {
              paintings.length > 0
                ? (
                  <ThumbnailColumn
                    thumbnails={paintings} />
                )
                : <div className="flex-column thumbnail-column">
                  <p>There are no images</p>
                </div>
            }
            {
              photographs.length > 0
                ? (
                  <ThumbnailColumn
                    thumbnails={photographs} />
                )
                : <div className="flex-column thumbnail-column">
                  <p>There are no images</p>
                </div>
            }
            {
              other.length > 0
                ? (
                  <ThumbnailColumn
                    thumbnails={other} />
                )
                : <div className="flex-column thumbnail-column">
                  <p>There are no images</p>
                </div>
            }
          </div>
        </div>
      );
    } else {
      return <h3 className="text-center mt-3">An error occurred</h3>;
    }
  }
}
