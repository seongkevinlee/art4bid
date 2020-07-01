import React from 'react';

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImg: this.props.userInfo.profileImg,
      profileImgFileObject: '',
      coverImg: this.props.userInfo.coverImg,
      coverImgFileObject: '',
      location: this.props.userInfo.location,
      city: '',
      description: this.props.userInfo.description,
      email: this.props.userInfo.email,
      userId: this.props.userInfo.userId,
      userName: this.props.userInfo.userName,
      selectedProfileImgFile: null,
      selectedCoverImgFile: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleProfileImgChange = this.handleProfileImgChange.bind(this);
    this.handleCoverImgChange = this.handleCoverImgChange.bind(this);
    this.getLocationByZipcode = this.getLocationByZipcode.bind(this);
    this.handleCoverImgClick = this.handleCoverImgClick.bind(this);
    this.handleProfileImgClick = this.handleProfileImgClick.bind(this);
    this.coverImgUploader = React.createRef();
    this.profileImgUploader = React.createRef();
  }

  componentDidMount() {
    const { location } = this.state;
    if (location) {
      this.getLocationByZipcode(location);
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.id === 'location' && event.target.value.trim().length === 5) {
      this.getLocationByZipcode(event.target.value.trim());
    }
  }

  handleProfileImgChange(event) {
    if (event.target.files[0]) {
      this.setState({
        selectedProfileImgFile: event.target.files[0],
        profileImgFileObject: URL.createObjectURL(event.target.files[0]),
        profileImg: event.target.files[0].name
      });
    }
  }

  handleCoverImgChange(event) {
    if (event.target.files[0]) {
      this.setState({
        selectedCoverImgFile: event.target.files[0],
        coverImgFileObject: URL.createObjectURL(event.target.files[0]),
        coverImg: event.target.files[0].name
      });
    }
  }

  handleCoverImgClick() {
    this.coverImgUploader.current.click();
  }

  handleProfileImgClick() {
    this.profileImgUploader.current.click();
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const { profileImg, coverImg, description, location, email, userId } = this.state;
    const profileData = new FormData();
    const newDate = Date.now();
    const newProfileFileURL = profileImg.split('.')[0].length > 13 ? profileImg.substring(13) : profileImg;
    const newCoverFileURL = coverImg.split('.')[0].length > 13 ? coverImg.substring(13) : coverImg;
    const changedProfileFileName = newDate.toString().concat(newProfileFileURL.split(' ').join(''));
    const changedCoverFileName = newDate.toString().concat(newCoverFileURL.split(' ').join(''));

    if (this.state.selectedProfileImgFile) {
      profileData.append('image', this.state.selectedProfileImgFile, changedProfileFileName);
    }
    if (this.state.selectedCoverImgFile) {
      profileData.append('image', this.state.selectedCoverImgFile, changedCoverFileName);
    }
    if (profileImg) {
      profileData.append('profileImg', changedProfileFileName);
    }
    if (coverImg) {
      profileData.append('coverImg', changedCoverFileName);
    }
    if (description) {
      profileData.append('description', description);
    }
    if (location) {
      profileData.append('location', location);
    }
    if (email) {
      profileData.append('email', email);
    }

    fetch(`/api/user/${userId}`, {
      method: 'POST',
      body: profileData
    })
      .then(() => {
        this.props.getUserData();
        this.props.editModeToggle();
      })
      .catch(err => console.error(err));
  }

  handleCancel() {
    event.preventDefault();
    this.props.editModeToggle();
    this.props.getUserData();
  }

  getLocationByZipcode(zipcode) {
    const host = 'https://www.zipcodeapi.com/rest';
    const key = 'js-VdpRhCiVZ9dvq6rnYEmkyzyJ6frYN5RJHQKTtfS8CnnZB130NLTKIBRce8xawVmG';
    const param = 'info.json';
    const url = `${host}/${key}/${param}/${zipcode}/degrees`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.city) {
          this.setState({
            city: `${data.city},${data.state}`
          });
        } else {
          this.setState({
            location: '',
            city: 'No city found'
          });
        }
      })
      .catch(err => console.error(err.message));
  }

  render() {
    const {
      profileImg,
      profileImgFileObject,
      coverImg,
      coverImgFileObject,
      description,
      userName,
      location,
      city,
      email
    } = this.state;
    const {
      handleCoverImgChange,
      handleCoverImgClick,
      handleSubmit,
      coverImgUploader,
      profileImgUploader,
      handleProfileImgChange,
      handleProfileImgClick
    } = this;
    return (
      <div className='d-flex flex-column align-items-center'>
        <div className='edit-profile-header d-flex justify-content-between col-12 mb-2 mt-1'>
          <div
            className='back-container text-center d-flex justify-content-start align-items-center'
          >
            <img type='button' className="back-arrow" src="./images/backarrow.png" alt="back-arrow" onClick={this.handleCancel} />
          </div>
          <div className='header-title pt-3 pb-3'>EDIT</div>
          <div className="back-container d-flex justify-content-center align-items-center">
            <button
              type="Submit"
              className="yes-button"
              style={{ height: '40px' }}
              onClick={handleSubmit}>
              SAVE
            </button>
          </div>
        </div>
        <div
          className='coverPhotoEdit d-flex flex-column align-items-center justify-content-center pt-4 pb-4'
          style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4))' }}>
          {coverImg
            ? (
              <img
                className="cover-img-upload rounded"
                alt=""
                src={coverImgFileObject || `images/user-profiles/${coverImg}`}
                onClick={handleCoverImgClick}></img>
            )
            : (<div
              className="cover-img-upload"
              onClick={handleCoverImgClick}></div>)
          }
          <input
            hidden
            type="file"
            accept=".png, .jpeg, .gif"
            ref={coverImgUploader}
            onChange={handleCoverImgChange}
          />
          {profileImg
            ? (
              <img
                className="profile-img-upload"
                alt=""
                src={profileImgFileObject || `images/user-profiles/${profileImg}`}
                onClick={handleProfileImgClick}></img>
            )
            : (
              <div
                className="profileImgEdit profile-img-upload"
                onClick={handleProfileImgClick}>
                <i className="add-profile-img fas fa-plus fa-3x"></i>
              </div>
            )
          }
          <input
            hidden
            type="file"
            name="profile-img-upload"
            accept=".png, .jpeg, .gif"
            ref={profileImgUploader}
            onChange={handleProfileImgChange}
          />
          <h4>{userName}</h4>
        </div>
        <textarea
          name="description"
          id="description-input"
          className='description-input mt-2 mb-2 border-0 text-center'
          cols="50"
          rows="4"
          placeholder='Enter description here...'
          value={description || ''}
          onChange={this.handleChange}>
        </textarea>
        <div className='location-info d-flex flex-column align-items-center justify-content-center'>
          <div className='d-flex flex-end justify-content-center align-items-end col-12'>
            <label htmlFor="zip-input" className='col text-center'>Your Zip-code:</label>
            <input
              limit="5"
              name='location'
              id='location'
              type="number"
              value={location || ''}
              className='zip-input mt-3 col-5 border-0'
              onChange={this.handleChange} />
          </div>
          <div className='d-flex flex-end justify-content-center align-items-end col-12'>
            <label htmlFor="location" className='col text-center'>Location:</label>
            <input
              name='city'
              id='city'
              type="text"
              disabled
              value={city}
              className='zip-input mt-3 col-5 border-0 text-center' />
          </div>
          <div className='d-flex flex-end justify-content-center align-items-end col-12'>
            <label htmlFor="email-input" className='col text-center'>Email:</label>
            <input
              name='email'
              id='email'
              type="text"
              value={email || ''}
              onChange={this.handleChange}
              className='email-input mt-3 col-5 border-0'
            />
          </div>
        </div>
      </div>
    );
  }
}
