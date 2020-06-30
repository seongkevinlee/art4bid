import React from 'react';

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImg: this.props.userInfo.profileImg,
      coverImg: this.props.userInfo.coverImg,
      location: this.props.userInfo.location,
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
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleProfileImgChange(event) {
    this.setState({
      selectedProfileImgFile: event.target.files[0],
      profileImg: event.target.files[0].name
    });
  }

  handleCoverImgChange(event) {
    this.setState({
      selectedCoverImgFile: event.target.files[0],
      coverImg: event.target.files[0].name
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const { profileImg, coverImg, description, location, email, userId } = this.state;
    const changedProfileImg = Date.now().toString().concat(profileImg.split(' ').join(''));
    const changedCoverImg = Date.now().toString().concat(coverImg.split(' ').join(''));
    const profileData = new FormData();
    if (this.state.selectedProfileImgFile) {
      profileData.append('image', this.state.selectedProfileImgFile, changedProfileImg);
    }
    if (this.state.selectedCoverImgFile) {
      profileData.append('image', this.state.selectedCoverImgFile, changedCoverImg);
    }
    if (profileImg) {
      profileData.append('profileImg', changedProfileImg);
    }
    if (coverImg) {
      profileData.append('coverImg', changedCoverImg);
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
      .then(response => {
        response.json();
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

  render() {
    const { profileImg, coverImg, description, userName, location, email } = this.state;

    return (
      <div className='d-flex flex-column align-items-center'>
        <div className='d-flex justify-content-between col-12 mb-2 mt-1'>
          <div
            className='back-container text-center d-flex justify-content-start align-items-center'
          >
            <img type='button' className="back-arrow" src="./images/backarrow.png" alt="back-arrow" onClick={this.handleCancel}/>
          </div>
          <div className='header-title pt-3 pb-3'>EDIT</div>
          <button
            className='btn btn-submit-header text-center'
            onClick={this.handleSubmit}>
            SAVE
          </button>
        </div>
        <div className='coverPhotoEdit d-flex flex-column align-items-center justify-content-center pt-4 pb-4' style={{ backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(/images/user-profiles/${coverImg})` }}>
          <input
            type="file"
            id="cover-img-upload"
            name="cover-img-upload"
            accept=".png, .jpeg, .gif"
            className="cover-img-upload"
            onChange={this.handleCoverImgChange}
          />
          <button
            className='profileImgEdit btn'
            style={{ backgroundImage: `url(/images/user-profiles/${profileImg})` } }>
            {!profileImg ? <i className="fas fa-plus fa-3x"></i> : null}
          </button>
          <input
            type="file"
            id="profile-img-upload"
            name="profile-img-upload"
            accept=".png, .jpeg, .gif"
            className="profile-img-upload"
            onChange={this.handleProfileImgChange}
          />
          <h4>{userName}</h4>
        </div>
        <textarea
          name="description"
          id="description-input"
          className='description-input mt-2 mb-2 border-0'
          cols="50"
          rows="4"
          placeholder='Enter description here...'
          value={description}
          onChange={this.handleChange}>
        </textarea>
        <div className='location-info d-flex flex-column align-items-center justify-content-center'>
          <div className='d-flex flex-end justify-content-center align-items-end col-12'>
            <label htmlFor="zip-input" className='col-5 text-center'>Your Zip-code:</label>
            <input
              name='location'
              id='location'
              type="number"
              value={location}
              className='zip-input mt-3 col-5 border-0'
              onChange={this.handleChange}/>
          </div>
          <div className='d-flex flex-end justify-content-center align-items-end col-12'>
            <label htmlFor="location" className='col-5 text-center'>Location:</label>
            <input
              name='city'
              id='city'
              type="text"
              className='zip-input mt-3 col-5 border-0'
              disabled/>
          </div>
          <div className='d-flex flex-end justify-content-center align-items-end col-12'>
            <label htmlFor="email-input" className='col-5 text-center'>Email:</label>
            <input
              name='email'
              id='email'
              type="text"
              value={email}
              onChange={this.handleChange}
              className='email-input mt-3 col-5 border-0'
            />
          </div>
        </div>
      </div>
    );
  }
}
