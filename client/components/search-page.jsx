import React from 'react';
import Autocomplete from 'react-google-autocomplete';
import PaintingsThumbnailColumn from './paintings-thumbnail-column';
import PhotographsThumbnailColumn from './photographs-thumbnail-column';
import OtherThumbnailColumn from './other-thumbnail-column';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      paintings: [],
      photographs: [],
      other: [],
      city: '',
      query: ''
    };
    this.getThumbnails = this.getThumbnails.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.getZipcodesByCity = this.getZipcodesByCity.bind(this);
    this.getZipcodesByZipcodeWithinRadius = this.getZipcodesByZipcodeWithinRadius.bind(this);
    this.searchPostsByZipcodes = this.searchPostsByZipcodes.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.loadPostsAgain = this.loadPostsAgain.bind(this);
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
          this.showMessage('failed to find data', 1000);
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
          this.showMessage('failed to find data', 1000);
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
      this.showMessage('failed to find data', 1000);
    }
  }

  handleSearchChange() {
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      search: event.target.value
    });
  }

  handleSearchClick(selectedPlace) {
    const { search } = this.state;
    if (selectedPlace.length) {
      const city = selectedPlace.split(',')[0].trim().toUpperCase();
      const state = selectedPlace.split(',')[1] ? selectedPlace.split(',')[1].trim().substring(0, 2).toUpperCase() : '';
      this.getZipcodesByCity(city, state);
    } else if (search && search.trim().length > 0) {
      // radius mile is set to 5 as default
      this.getZipcodesByZipcodeWithinRadius(search, 5);
    } else {
      this.showMessage('please enter keyword', 1000);
    }
  }

  showMessage(message, time) {
    setTimeout(() => {
      this.setState({
        search: ''
      });
    }, time);
    this.setState({
      search: message
    });
  }

  loadPostsAgain() {
    this.setState({
      search: '',
      city: '',
      query: ''
    });
    this.getThumbnails('paintings');
    this.getThumbnails('photographs');
    this.getThumbnails('other');
  }

  handleSubmit(event) {
    event.preventDefault();
    this.handleSearchClick();
  }

  render() {
    const { handleSearchChange, handleSearchClick, loadPostsAgain } = this;
    const { search, paintings, photographs, other } = this.state;
    if (paintings.length > 0 || photographs.length > 0 || other.length > 0) {
      return (
        <div>
          <div>
            <form className="text-center pt-3">
              <div className="position-relative">
                <Autocomplete
                  autoFocus
                  types={['(regions)']}
                  onPlaceSelected={place => {
                    return handleSearchClick(place.formatted_address);
                  }}
                  componentRestrictions={{ country: 'us' }}
                  className="search-bar text-center w-75 border-0 pt-2 pb-2"
                  type="text"
                  name="search"
                  placeholder="search"
                  value={search || ''}
                  onChange={handleSearchChange}/>
                <img
                  alt=""
                  className="search-mag position-absolute cursor-pointer"
                  src="./images/search-solid.svg"
                  onClick={handleSearchClick}></img>
              </div>
            </form>
          </div>
          <div className="d-flex mt-4 justify-content-around text-center" style={{
            marginBottom: '6px'
          }}>
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
                  <PaintingsThumbnailColumn
                    // thumbnails={paintings}
                    setView={this.props.setView}
                    getPostInfo={this.props.getPostInfo}
                  />
                )
                : <div className="flex-column thumbnail-column">
                  <p className="h6 mt-4 px-1 text-secondary">There are no images</p>
                </div>
            }
            {
              photographs.length > 0
                ? (
                  <PhotographsThumbnailColumn
                    // thumbnails={photographs}
                    setView={this.props.setView}
                    getPostInfo={this.props.getPostInfo}
                  />
                )
                : <div className="flex-column thumbnail-column">
                  <p className="h6 mt-4 px-1 text-secondary">There are no images</p>
                </div>
            }
            {
              other.length > 0
                ? (
                  <OtherThumbnailColumn
                    // thumbnails={other}
                    setView={this.props.setView}
                    getPostInfo={this.props.getPostInfo}
                  />
                )
                : <div className="flex-column thumbnail-column">
                  <p className="h6 mt-4 px-1 text-secondary">There are no images</p>
                </div>
            }
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div>
            <form className="text-center pt-3">
              <div className="position-relative">
                <Autocomplete
                  autoFocus
                  types={['(regions)']}
                  onPlaceSelected={place => {
                    handleSearchClick(place.formatted_address);
                  }}
                  componentRestrictions={{ country: 'us' }}
                  className="search-bar text-center w-75 border-0 pt-2 pb-2"
                  type="text"
                  name="search"
                  placeholder="search"
                  value={search || ''}
                  onChange={handleSearchChange} />
                <img
                  alt=""
                  className="search-mag position-absolute cursor-pointer"
                  src="./images/search-solid.svg"
                  onClick={handleSearchClick}></img>
              </div>
            </form>
          </div>
          <div className="d-flex mt-4 justify-content-around text-center" style={{
            marginBottom: '6px'
          }}>
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
            <h6 className="mt-5 text-center mt-3">No posts are found</h6>
            <div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={loadPostsAgain}>Try Again</button>
            </div>
          </div>
        </>
      );
    }
  }
}
