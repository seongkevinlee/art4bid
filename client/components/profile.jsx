import React from 'react';
import EditProfile from './edit-profile';
import UserPosts from './user-posts';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      userId: this.props.userInfo.userId,
      userInfo: {}
    };

    this.editModeToggle = this.editModeToggle.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData() {
    fetch(`/api/user/${this.state.userId}`)
      .then(res => res.json())
      .then(data => { this.setState({ userInfo: data }); })
      .catch(err => console.error(err));
  }

  editModeToggle() {
    if (this.state.editMode) {
      this.setState({
        editMode: false
      });
    } else {
      this.setState({
        editMode: true
      });
    }
  }

  renderProfile() {
    const { profileImg, coverImg, description, userName } = this.state.userInfo;

    return (
      <div className="d-flex flex-column align-items-center">
        <div className="profile-header d-flex justify-content-between col-12 mt-1">
          <div className="back-container"></div>
          <div className="header-title pt-3 pb-3">PROFILE</div>
          <button
            className="profile-edit-btn btn btn-submit-header text-center"
            onClick={this.editModeToggle}
          >
            EDIT
          </button>
        </div>
        <div
          className="coverPhoto d-flex flex-column align-items-center justify-content-center pt-4 col-12"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(/images/user-profiles/${coverImg})`
          }}
        >
          <div
            className="profileImg-container"
            style={{
              backgroundImage: `url(/images/user-profiles/${profileImg})`
            }}
          ></div>
          <h4 id="profileUserName">{userName}</h4>
          <p className="profile-description text-center mt-2 mb-2 ml-1 mr-1">
            {!description ? ' ' : description}
          </p>
        </div>
        <UserPosts getPostInfo={this.props.getPostInfo} setView={this.props.setView}/>
      </div>
    );
  }

  renderEditProfile() {
    return (
      <EditProfile
        editModeToggle={this.editModeToggle}
        userInfo={this.state.userInfo}
        getUserData={this.getUserData}
      />
    );
  }

  render() {
    if (this.state.editMode === false) {
      return this.renderProfile();
    } else {
      return this.renderEditProfile();
    }
  }
}
