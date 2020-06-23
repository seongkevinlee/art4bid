import React from 'react';

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImg: '',
      coverImg: '',
      description: '',
      location: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleChange(event) {
    if (event.target.id === 'zip-input') {
      this.setState({
        location: event.target.value
      });
    }
    if (event.target.id === 'description-input') {
      this.setState({
        description: event.target.value
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const profileDetails = {
      profileImg: this.state.profileImg,
      coverImg: this.state.coverImg,
      description: this.state.description,
      location: this.state.location
    };
    alert(profileDetails); // filler function since ESLINT wont allow un-used variables
    this.setState({
      profileImg: '',
      coverImg: '',
      description: '',
      location: ''
    });
  }

  handleCancel() {
    event.preventDefault();
    alert('This will return back to the view profile page.');
  }

  render() {
    return (
      <div className='d-flex flex-column align-items-center'>
        <div className='d-flex justify-content-between col-12 mb-2 mt-1'>
          <button
            className='btn btn-cancel-header text-center d-flex justify-content-center align-items-center'
            onClick={this.handleCancel}>
            CANCEL
          </button>
          <div className='header-title pt-3 pb-3'>PROFILE</div>
          <button
            className='btn btn-submit-header text-center'
            onClick={this.handleSubmit}>
            SAVE
          </button>
        </div>
        <div className='coverPhotoEdit d-flex flex-column align-items-center justify-content-center pt-4 pb-4'>
          <button className='profileImgEdit btn'>
            <i className="fas fa-plus fa-3x"></i>
          </button>
          <h4>myCoolUserName</h4>
        </div>
        <textarea
          name="description-input"
          id="description-input"
          className='description-input mt-2 mb-2 border-0'
          cols="50"
          rows="4"
          placeholder='Enter description here...'
          onChange={this.handleChange}>
        </textarea>
        <div className='location-info d-flex flex-column align-items-center justify-content-center'>
          <div className='d-flex flex-end justify-content-center align-items-end col-12'>
            <label htmlFor="zip-input" className='col-5 text-center'>Your Zip-code:</label>
            <input
              name='zip-input'
              id='zip-input'
              type="number"
              className='zip-input mt-3 col-5 border-0'
              onChange={this.handleChange}/>
          </div>
          <div className='d-flex flex-end justify-content-center align-items-end col-12'>
            <label htmlFor="zip-input" className='col-5 text-center'>Location:</label>
            <input
              name='zip-input'
              id='zip-input'
              type="number"
              className='zip-input mt-3 col-5 border-0'
              disabled/>
          </div>
        </div>
      </div>
    );
  }
}
