import React from 'react';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileImg: '',
      coverImg: '',
      description: '',
      location: ''
    };
  }

  render() {
    return (
      <div className='d-flex flex-column align-items-center'>
        <div className='header-title pt-3 pb-3'>MY PROFILE</div>
        <div className='coverPhotoEdit d-flex flex-column align-items-center justify-content-center pt-4 pb-4'>
          <button className='profileImgEdit btn'><i className="fas fa-plus fa-3x"></i></button>
          <h4>myCoolUserName</h4>
        </div>
        <textarea name="descriptionInput" id="descriptionInput" className='descriptionInput mt-2' cols="50" rows="4" placeholder='Enter description here...'></textarea>
        <div className='location-info d-flex align-items-center justify-content-center'>
          <div className='d-flex flex-column flex-end align-items-end'>
            <h4>Your Zip-code:</h4>
            <h4>Your City:</h4>
          </div>
          <div className='d-flex flex-column flex-end align-items-end pr-3'>
            <input type="number" className='zip-input mt-3 col-6'/>
            <input type="text" className='city-display mt-3 col-6'/>
          </div>
        </div>
      </div>
    );
  }
}
