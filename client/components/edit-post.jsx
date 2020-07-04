import React from 'react';
import { Spring } from 'react-spring/renderprops';

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
      display: 'none'
    };
    this.baseState = this.state;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const {
      description,
      title,
      isDeleted,
      category,
      postId,
      sellerId
    } = this.state;

    let { notes } = this.state;
    if (!notes) {
      notes = ' ';
    }

    const request = {
      description: description,
      title: title,
      isDeleted: isDeleted,
      category: category,
      notes: notes,
      postId: postId,
      sellerId: sellerId
    };

    fetch('/api/edit/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })
      .then(data => {
        this.props.getPostInfo(this.props.postId);
        this.props.editModeToggle();
      })
      .catch(error => console.error('image uploading error', error));
  }

  render() {
    // Changing Category

    let paintingDisabled = null;
    let photoDisabled = null;
    let otherDisabled = null;

    if (this.props.postInfo.category) {
      switch (this.props.postInfo.category) {
        case 'paintings':
          paintingDisabled = 'disabled';
          break;
        case 'phot raphs':
          photoDisabled = 'disabled';
          break;
        case 'other':
          otherDisabled = 'disabled';
          break;
      }
    }

    return (
      <Spring
        from={{ marginRight: -500 }}
        to={{ marginRight: 0 }}
      >
        {
          props =>
            <div className="non-nav" style={props}>
              <header className="post-header text-center d-flex justify-content-between align-items-center pl-3 pr-3">
                <div
                  className='back-container text-center d-flex justify-content-start align-items-center'
                >
                  <img
                    type='button'
                    className="back-arrow"
                    src="./images/backarrow.png"
                    alt="back-arrow"
                    onClick={this.handleModal}
                  />
                </div>
                <div className="header-title pt-3 pb-3 new-post-header">EDIT POST</div>
                <div className="back-container d-flex justify-content-center align-items-center">
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

                <div className="title-description" style={{ margin: '0.5% 2%' }}>
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
                      <option disabled={paintingDisabled} value="paintings">Paintings</option>
                      <option disabled={photoDisabled} value="photographs">Photographs</option>
                      <option disabled={otherDisabled} value="other">Other</option>
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
                </div>
              </form>
            </div>
        }
      </Spring>
    );
  }
}
