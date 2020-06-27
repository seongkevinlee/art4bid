import React from 'react';

export default class PostBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highestBid: null,
      submittedBid: '',
      notes: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNotes = this.getNotes.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ submittedBid: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { submittedBid } = this.state;
    if (submittedBid[0] === '0') {
      alert(`${submittedBid} is not a valid number`);
    } else {
      const reqBody = {
        bidderId: this.props.userId,
        postId: this.props.postId,
        currentBid: submittedBid
      };
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      };
      fetch('/api/bid', req)
        .then(res => res.json())
        .then(bidInfo => {
          if (bidInfo.error) {
            alert(bidInfo.error);
          } else {
            this.props.getBidInfo(this.props.postId);
            alert('Bid has been successfully submitted');
          }
        })
        .catch(err => console.error(err.message));
    }
  }

  componentDidMount() {
    this.getNotes(this.props.postId);
  }

  getNotes(postId) {
    fetch(`api/notes/${postId}`)
      .then(res => res.json())
      .then(notes => {
        if (notes === null) {
          this.setState({ notes: 'There are no notes' });
        } else if (notes !== null) {
          this.setState({ notes });
        }
      });
  }

  render() {
    const userId = this.props.userId;
    const sellerId = this.props.sellerId;

    let notesOrBid =
      <div className="bid-buttons-container d-flex flex-column">
        <form onSubmit={this.handleSubmit}>
          <input
            name="bid-offer"
            id="bid-offer"
            type="number"
            placeholder="$0"
            value={this.state.submittedBid}
            onChange={this.handleChange}
          />
          <button
            id="submit-bid"
            type="submit"
          >Submit Bid</button>
        </form>

        <button id="message" type="button" onClick={() => this.props.messageBtnClick()}> Message</button>
      </div>;

    let totalBids = <p className="text-right m-0">Total Bids:</p>;
    let totalBidsNumber = <p className="m-0">{this.props.totalBids}</p>;
    if (userId === sellerId) {
      notesOrBid =
        <div className="notes-container">
          <div className="notes-text">
            <p>Notes</p>
            <p className="text-left">- {this.state.notes}</p>
          </div>
          <button
            id="edit-post"
            className="text-center"
          >Edit Post</button>
        </div>;

      totalBids = <p onClick={() => this.props.toggleBidHistory('on')} className="red-underline text-right m-0">Total Bids:</p>;
      totalBidsNumber = <p onClick={() => this.props.toggleBidHistory('on')} className="red-underline m-0">{this.props.totalBids}</p>;
    }
    return (
      <div>
        <div className="post-description">
          <p className="text-left">{this.props.description}</p>
        </div>
        <div className="post-bid-info d-flex align-items-center justify-content-between">
          {notesOrBid}
          <div className="bid-stats p-3">
            <p id="expire-disclaimer" className="text-center">All bids expire at 12AM PST on expiration date</p>
            <div className="bid-numbers d-flex justify-content-between">
              <div className="text-right bid-numbers">
                <p className="text-right m-0">Highest Bid:</p>
                {totalBids}
                <p className="text-right m-0">Expires:</p>
              </div>
              <div className="bid-numbers">
                <p className="m-0">${this.props.highestBid}</p>
                {totalBidsNumber}
                <p className="m-0">{this.props.bidEnd}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
