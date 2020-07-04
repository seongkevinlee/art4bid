import React from 'react';
import Autocomplete from 'react-google-autocomplete';
import ThumbnailColumn from './thumbnail-column';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        search: ''
      },
      message: '',
      search: '',
      paintings: [],
      photographs: [],
      other: [],
      city: '',
      query: ''
    };
    this.getThumbnails = this.getThumbnails.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.getZipcodesByCity = this.getZipcodesByCity.bind(this);
    this.getZipcodesByZipcodeWithinRadius = this.getZipcodesByZipcodeWithinRadius.bind(this);
    this.searchPostsByZipcodes = this.searchPostsByZipcodes.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.loadPostsAgain = this.loadPostsAgain.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const host = 'https://api.zippopotam.us/';
    const url = `${host}us/${state}/${city}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.places) {
          this.setState({
            search: ''
          });
          const zipcodesArr = [];
          data.places.map(place => {
            zipcodesArr.push(place['post code']);
          });
          this.searchPostsByZipcodes(zipcodesArr);
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

  handleSearchChange(e) {
    e.preventDefault();
    if (event.target.value.length < 2) {
      event.target.value = event.target.value.trim();
    }
    this.setState({
      search: event.target.value,
      formData: {
        search: event.target.value
      }
    });
  }

  showMessage(message, time) {
    setTimeout(() => {
      this.setState({
        message: ''
      });
    }, time);
    this.setState({
      message: message
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
    const { search } = this.state.formData;
    if (!isNaN(Number(search)) && search && search.trim().length > 0) {
      // radius mile is set to 5 as default
      this.getZipcodesByZipcodeWithinRadius(search, 5);
    } else if (search) {
      // const city = search.split(',')[0].trim().toUpperCase();
      let city = search.split(',')[0].trim();
      if (city.includes('.')) {
        city = city.split('.')[1].trim();
      }
      // Temporarily if state is empty, the default is 'CA'
      const state = search.split(',')[1] ? search.split(',')[1].trim().substring(0, 2) : 'CA';
      this.getZipcodesByCity(city, state);
    } else if (search === undefined) {
      this.showMessage('please click brush!', 1000);
    } else if (search.length === 0) {
      this.showMessage('please enter keyword!', 1000);
    }
    this.setState({
      formData: {
        search: ''
      }
    });
  }

  render() {
    const { handleSearchChange, loadPostsAgain, handleSubmit } = this;
    const { formData, message, paintings, photographs, other } = this.state;
    return (
      <div className="non-nav">
        <div>
          {message
            ? (
              <form className="text-center pt-3">
                <div className="position-relative">
                  <input
                    disabled
                    className="mx-auto search-bar text-center w-75 border-0 pt-2 pb-2 form-control"
                    placeholder={message}/>
                  <button
                    disabled
                    className="search-mag position-absolute cursor-pointer search-button">
                    <img
                      alt="search-button"
                      className="search-mag cursor-pointer"
                      src="./images/search-brush.png"></img>
                  </button>
                </div>
              </form>
            )
            : (
              <form className = "text-center pt-3" onSubmit = {e => handleSubmit(e) }>
                <div className = "position-relative">
                  <Autocomplete
                    autoFocus
                    types = { ['(regions)'] }
                    onPlaceSelected = {place => {
                      this.setState({
                        search: place.formatted_address
                      });
                    }}
                    formdata={formData}
                    componentRestrictions={{ country: 'us' }}
                    className="mx-auto search-bar text-center w-75 border-0 pt-2 pb-2 form-control"
                    type="text"
                    name="search"
                    placeholder="search"
                    value={formData.search}
                    onChange={e => handleSearchChange(e)} />
                  <button
                    type="submit"
                    className="search-mag position-absolute cursor-pointer search-button">
                    <img
                      alt="search-button"
                      className="search-mag cursor-pointer"
                      src="./images/search-brush.png"></img>
                  </button>
                </div>
              </form>
            )
          }
        </div>
        <div className="d-flex mt-3 justify-content-around text-center" style={{ marginBottom: '6px' }}>
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
        {(paintings.length > 0 || photographs.length > 0 || other.length > 0)
          ? (
            <div className="thumbnail-column-container d-flex justify-content-around">
              {
                paintings.length > 0
                  ? (
                    <ThumbnailColumn
                      setView={this.props.setView}
                      getPostInfo={this.props.getPostInfo}
                      category={'paintings'}
                    />
                  )
                  : <div className="flex-column thumbnail-column">
                    <p className="h6 mt-4 px-1 text-secondary">There are no posts</p>
                  </div>
              }
              {
                photographs.length > 0
                  ? (
                    <ThumbnailColumn
                      setView={this.props.setView}
                      getPostInfo={this.props.getPostInfo}
                      category={'photographs'}
                    />
                  )
                  : <div className="flex-column thumbnail-column">
                    <p className="h6 mt-4 px-1 text-secondary">There are no posts</p>
                  </div>
              }
              {
                other.length > 0
                  ? (
                    <ThumbnailColumn
                      setView={this.props.setView}
                      getPostInfo={this.props.getPostInfo}
                      category={'other'}
                    />
                  )
                  : <div className="flex-column thumbnail-column">
                    <p className="h6 mt-4 px-1 text-secondary">There are no posts</p>
                  </div>
              }
            </div>
          )
          : (
            <div className="text-center">
              <p className="mt-5 text-center mt-3">No posts are found</p>
              <div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={loadPostsAgain}>Try Again</button>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}
