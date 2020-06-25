import React from 'react';

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
      category: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit() {
    const {
      sellerId,
      description,
      imageUrl,
      title,
      startingBid,
      biddingEnabled,
      isDeleted,
      expiredAt,
      notes,
      category
    } = this.state;

    event.preventDefault();
    fetch('/api/post/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sellerId,
        description,
        imageUrl,
        title,
        startingBid,
        biddingEnabled,
        isDeleted,
        expiredAt,
        notes,
        category
      })
    })
      .then(res => res.json())
      .then(data => {
        // eslint-disable-next-line no-console
        console.log(data, 'data');
      });
  }

  ToggleButton() {
    this.setState(currentState => ({
      textDisplay: currentState.textDisplay
    }));
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
            onChange={this.handleChange}
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

          {/* toggle bidding */}
          <div>
            <button onClick={() => this.ToggleButton()}>Toggle</button>
            {!this.state.textDisplay && this.props.text}
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
        </form>
      </div>
    );
  }
}
