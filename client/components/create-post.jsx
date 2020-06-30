import React from 'react';
import ToggleButton from 'react-toggle-button';

export default class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.userInfo,
      textDisplay: false,
      sellerId: this.props.userInfo.userId,
      description: '',
      imageUrl: '',
      title: '',
      startingBid: '',
      biddingEnabled: false,
      isDeleted: false,
      expiredAt: '',
      notes: '',
      category: '',
      selectedFile: null,
      filePathImageURL: null,
      display: 'none'
    };
    this.baseState = this.state;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.dummyFunction = this.dummyFunction.bind(this);
  }

  dummyFunction() {
    // eslint-disable-next-line no-console
    console.log('does nothing');
  }

  handleModal() {
    this.setState({ display: '' });
  }

  // delete all changes
  handleReset() {
    this.setState(this.baseState);
  }

  handleCancel() {
    this.setState({ display: 'none' });
  }

  // setting state for each form input
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // setting state for image input
  handleFileChange(event) {
    const inputFile = document.getElementById(
      'imageUrl'
    );
    const replaceImage = document.getElementsByClassName('create-new-post-image');
    const file = inputFile.files[0];

    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', function () {
        replaceImage[0].setAttribute('src', this.result);
      });
      reader.readAsDataURL(file);
    }
    this.setState({
      selectedFile: event.target.files[0],
      [event.target.name]: event.target.value,
      filePathImageURL: event.target.files[0].name
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      sellerId,
      description,
      filePathImageURL,
      title,
      startingBid,
      biddingEnabled,
      isDeleted,
      expiredAt,
      notes,
      category
    } = this.state;

    const formData = new FormData();

    // Update the formData object
    formData.append('image', this.state.selectedFile, this.state.imageUrl.name);
    formData.append('sellerId', sellerId);
    formData.append('description', description);
    formData.append('imageUrl', `/images/user-posts/${filePathImageURL}`);
    formData.append('title', title);
    formData.append('startingBid', startingBid);
    formData.append('biddingEnabled', biddingEnabled);
    formData.append('isDeleted', isDeleted);
    formData.append('expiredAt', expiredAt);
    formData.append('notes', notes);
    formData.append('category', category);

    fetch(`/api/post/image/${'user-posts'}`, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        res.json();
      })
      .then(data => {
        // eslint-disable-next-line no-console
        console.log('it works');
        this.props.setView('profile');
      })
      .catch(error => console.error('image uploading error', error));
  }

  render() {
    return (
      <div>
        <header className="post-header text-center d-flex justify-content-between align-items-center pl-3 pr-3">
          <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
            <img
              alt=""
              onClick={this.handleModal}
              className="header-icon"
              src="./images/kindpng.png"
            ></img>
          </div>
          <div className="header-title pt-3 pb-3 new-post-header">NEW POST</div>
          <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
            <button
              type="Submit"
              form="new-post"
              className="yes-button"
              style={{ height: '40px' }}
            >
              SAVE
            </button>
          </div>
        </header>

        <div
          className="new-post-modal"
          style={{ display: `${this.state.display}` }}
        >
          <div className="new-post-modal-content">
            Are you sure you want to cancel creating a post?
            <div>
              <button className="yes-button" onClick={this.handleReset}>
                Yes
              </button>
              <button onClick={this.handleCancel}>No</button>
            </div>
          </div>
        </div>

        <form id="new-post" onSubmit={this.handleSubmit}>
          {/* add picture */}
          <div style={{ textAlign: 'center' }}>
            <img src="./images/create-new-post.png" alt="create-new-post" className="create-new-post-image" />
          </div>

          <label htmlFor="imageUrl"></label>
          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            accept="image/png, image/jpeg"
            className="new-post-input"
            title=" "
            value={this.state.imageUrl}
            onChange={this.handleFileChange}
            required
          />

          <div className="title-description">
            {/* enter title */}
            <label htmlFor="title"></label>
            <input
              type="text"
              placeholder="Enter Title"
              value={this.state.title}
              onChange={this.handleChange}
              name="title"
              form="new-post"
              required
            />

            {/* enter description */}
            <label htmlFor="description"></label>
            <textarea
              placeholder="Enter Description"
              value={this.state.description}
              onChange={this.handleChange}
              name="description"
              form="new-post"
              className="enter-description"
              required
            />
          </div>

          <div className="second-half">
            <div className="category-notes">
              {/* select category */}
              <label name="category"></label>
              <select
                name="category"
                id="category"
                required
                // value={this.state.category}
                onChange={this.handleChange}
                style={{ padding: '7.5px', color: 'gray' }}
                defaultValue={this.state.category}
              >
                <option disabled="disabled" value={this.state.category}>
                  Select Category
                </option>
                <option value="paintings">Paintings</option>
                <option value="photographs">Photographs</option>
                <option value="other">Other</option>
              </select>

              {/* notes */}
              <label htmlFor="notes"></label>
              <textarea
                placeholder="Notes"
                name="notes"
                value={this.state.notes}
                onChange={this.handleChange}
                style={{ height: '80px' }}
              />
            </div>

            <div className="bidding-content">
              {/* toggle bidding button */}
              <div>
                <ToggleButton
                  className="big"
                  oChange={this.dummyFunction}
                  value={this.state.biddingEnabled || false}
                  onToggle={value => {
                    this.setState({
                      biddingEnabled: !this.state.biddingEnabled
                    });
                  }}
                />
              </div>

              {/* starting bid */}
              <label htmlFor="starting-bid">Starting Bid:</label>
              <input
                disabled={!this.state.biddingEnabled}
                type="number"
                min="1.00"
                placeholder="$0.00"
                name="startingBid"
                value={this.state.startingBid}
                onChange={this.handleChange}
              />

              {/* bid expiry */}
              <label htmlFor="bid-expiry">Bid Expiration Date:</label>
              <input
                disabled={!this.state.biddingEnabled}
                type="date"
                name="expiredAt"
                value={this.state.expiredAt}
                onChange={this.handleChange}
                className="bid-expiry"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
