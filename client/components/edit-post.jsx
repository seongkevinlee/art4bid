import React from 'react';
import ToggleButton from 'react-toggle-button';

export default class EditPost extends React.Component {
  constructor(props) {
    super(props);
    const { userId, postInfo } = this.props;
    this.state = {
      user: userId,
      postId: postInfo.postId,
      textDisplay: false,
      sellerId: postInfo.sellerId,
      description: postInfo.description,
      imageUrl: postInfo.imageUrl,
      title: postInfo.title,
      startingBid: postInfo.startingBid,
      biddingEnabled: postInfo.biddingEnabled,
      isDeleted: postInfo.isDeleted,
      expiredAt: postInfo.expiredAt,
      notes: postInfo.notes,
      category: postInfo.category,
      // selectedFile: null,
      // filePathImageURL: null,
      // newImageUrl: '',
      display: 'none'
    };
    this.baseState = this.state;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleFileChange = this.handleFileChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const { notes } = this.props.postInfo;
    if (notes === null || notes === ' ') {
      this.setState({ notes: '' });
    }

    const expireDate = this.props.postInfo.expiredAt.slice(0, 10);
    this.setState({ expiredAt: expireDate });
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
  // handleFileChange(event) {
  //   if (!this.state.imageUrl) {
  //     this.setState({
  //       filePathImageURL: this.props.imageUrl
  //     });
  //   }

  //   this.setState({
  //     selectedFile: event.target.files[0],
  //     [event.target.name]: event.target.value,
  //     filePathImageURL: event.target.files[0].name
  //   });
  // }

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const {
      sellerId,
      description,
      // filePathImageURL,
      title,
      startingBid,
      biddingEnabled,
      isDeleted,
      expiredAt,
      category,
      postId
    } = this.state;

    let { notes } = this.state;
    if (!notes) {
      notes = ' ';
    }
    const formData = new FormData();

    // const changedPostImg = Date.now().toString().concat(filePathImageURL.split(' ').join(''));
    // Update the formData object
    // formData.append('image', this.state.selectedFile, changedPostImg);
    formData.append('sellerId', sellerId);
    formData.append('description', description);
    // formData.append('imageUrl', `/images/user-posts/${changedPostImg}`);
    formData.append('title', title);
    formData.append('startingBid', startingBid);
    formData.append('biddingEnabled', biddingEnabled);
    formData.append('isDeleted', isDeleted);
    formData.append('expiredAt', expiredAt);
    formData.append('notes', notes);
    formData.append('category', category);
    formData.append('postId', postId);

    fetch(`/api/edit/post/image/${'user-posts'}`, {
      method: 'POST',
      body: formData
    })
      // .then(res => {
      //   console.log(res.json());
      // })
      .then(data => {
        this.props.getPostInfo(this.props.postId);
        this.props.editModeToggle();
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
          <div className="header-title pt-3 pb-3 new-post-header">EDIT POST</div>
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
            Are you sure you want to cancel editing a post?
            <div>
              <button className="yes-button" onClick={() => {
                this.handleReset();
                this.props.editModeToggle();
              }}>
                Yes
              </button>
              <button onClick={this.handleCancel}>No</button>
            </div>
          </div>
        </div>
        <form id="new-post" onSubmit={this.handleSubmit}>
          {/* add picture */}
          <div style={{ textAlign: 'center' }}>
            <img src={this.state.imageUrl} alt="create-new-post" className="create-new-post-image edit-post" />
          </div>

          {/* <label htmlFor="imageUrl"></label>
          <input
            type="file"
            id="imageUrl"
            name="newImageUrl"
            accept="image/png, image/jpeg"
            className="new-post-input"
            title=" "
            value={this.state.newImageUrl}
            onChange={this.handleFileChange}
            required
          /> */}

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
                placeholder="$0"
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
