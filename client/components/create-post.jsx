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
      filePathImageURL: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.dummyFunction = this.dummyFunction.bind(this);
  }

  dummyFunction() {
    // eslint-disable-next-line no-console
    console.log('does nothing');
  }

  // setting state for each form input
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // setting state for image input
  handleFileChange(event) {
    this.setState({
      selectedFile: event.target.files[0],
      [event.target.name]: event.target.value,
      filePathImageURL: event.target.files[0].name
    });
  }

  handleSubmit() {
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
      })
      .catch(error => console.error('image uploading error', error));

    // fetch('/api/post/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(json)
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     // eslint-disable-next-line no-console
    //     console.log('data', data);
    //   });
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-between">
          <button>left arrow</button>
          <div className="header-title pt-3 pb-3">NEW POST</div>
          <button type="Submit" form="new-post">
            SAVE
          </button>
        </div>
        <form form="new-post" onSubmit={this.handleSubmit}>
          {/* add picture */}
          <label htmlFor="imageUrl">Choose an image:</label>

          <input
            type="file"
            id="imageUrl"
            name="imageUrl"
            accept="image/png, image/jpeg"
            className="newPostPicture"
            title=" "
            value={this.state.imageUrl}
            onChange={this.handleFileChange}
            required
          />

          {/* enter title */}
          <label htmlFor="title"></label>
          <input
            type="text"
            placeholder="Enter Title"
            value={this.state.title}
            onChange={this.handleChange}
            name="title"
            required
          />

          {/* enter description */}
          <label htmlFor="description"></label>
          <input
            type="text"
            placeholder="Enter Description"
            value={this.state.description}
            onChange={this.handleChange}
            name="description"
            required
          />

          {/* select category */}
          <label name="category"></label>
          <select
            name="category"
            id="category"
            required
            value={this.state.category}
            onChange={this.handleChange}
          // defaultValue=" "
          >
            <option disabled="disabled" value={this.state.category}>
              Select Category
            </option>
            <option value="paintings">Paintings</option>
            <option value="photographs">Photographs</option>
            <option value="other">Other</option>
          </select>

          {/* toggle bidding button */}
          <div>
            Bidding{' '}
            <ToggleButton
              className="big"
              onChange={this.dummyFunction}
              value={this.state.biddingEnabled || false}
              onToggle={value => {
                this.setState({
                  biddingEnabled: !this.state.biddingEnabled
                });
              }}
            />
          </div>

          {/* notes */}
          <label htmlFor="notes"></label>
          <input
            type="textarea"
            placeholder="notes..."
            name="notes"
            value={this.state.notes}
            onChange={this.handleChange}
          />

          {/* starting bid */}
          <label htmlFor="starting-bid">Starting Bid</label>
          <input
            type="number"
            min="1.00"
            placeholder="$0.00"
            name="startingBid"
            value={this.state.startingBid}
            onChange={this.handleChange}
          />

          {/* bid expiry */}
          <label htmlFor="bid-expiry">Bid Expiration Date</label>
          <input
            type="date"
            name="expiredAt"
            value={this.state.expiredAt}
            onChange={this.handleChange}
          />

          <button type="Submit">SAVE</button>
        </form>
      </div>
    );
  }
}
