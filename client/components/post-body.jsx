import React from 'react';

export default class PostBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submittedBid: '',
      notes: '',
      bidAlert: null,
      isEditing: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNotes = this.getNotes.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  handleChange(event) {
    event.preventDefault();
    const value = event.target.value;
    this.setState({ submittedBid: value });
  }

  handleClick() {
    event.preventDefault();
    this.setState({
      isEditing: !this.state.isEditing
    });
    event.target.value = '';
  }

  handleSubmit(event) {
    event.preventDefault();
    const { submittedBid } = this.state;
    if (submittedBid[0] === '0') {
      const error = `${submittedBid} is not a valid number`;
      this.setState({ bidAlert: error });
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
            this.setState({ bidAlert: bidInfo.error });
          } else {
            this.props.getBidInfo(this.props.postId);
            this.setState({
              bidAlert: 'Bid has been successfully submitted',
              isEditing: false
            });
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
        if (notes === ' ' || !notes) {
          this.setState({ notes: 'There are no notes' });
        } else if (notes !== null) {
          this.setState({ notes });
        }
      });
  }

  render() {
    const { userId, sellerId, highestBid, description, bidEnd, biddingEnabled } = this.props;
    const { handleSubmit, handleChange, handleClick } = this;
    const { isEditing } = this.state;
    const formattedHighestBid = new Intl.NumberFormat().format(highestBid);
    const bidDate = new Date(this.props.bidEnd);
    bidDate.setUTCMinutes(1439);
    bidDate.setUTCSeconds(59);
    const biddingClosed = bidDate < new Date();

    let notesOrBid = (
      <div
        className="bid-buttons-container d-flex flex-column"
        style={{ opacity: biddingClosed ? '40%' : '100%' }}
      >
        <form onSubmit={handleSubmit} id="form">
          {isEditing ? (
            <input
              id="bid-offer"
              type="number"
              onChange={handleChange}
              onBlur={handleClick}
            />
          ) : (
            <input
              id="bid-offer"
              type="text"
              placeholder={`$${formattedHighestBid}`}
              onClick={handleClick}
              readOnly
            />
          )}

          <button id="submit-bid" type={biddingClosed ? 'reset' : 'submit'}>
            Submit Bid
          </button>
        </form>

        <button
          id="message"
          type="button"
          onClick={() => this.props.messageBtnClick()}
        >
          {' '}
          Message
        </button>
      </div>
    );

    let totalBids = <p className="text-right m-0">Total Bids:</p>;
    let totalBidsNumber = <p className="m-0">{this.props.totalBids}</p>;
    if (userId === sellerId) {
      notesOrBid = (
        <div className="notes-container">
          <div className="notes-text">
            <p>Notes</p>
            <p className="text-left">- {this.state.notes}</p>
          </div>
          <button
            id="edit-post"
            className="text-center"
            onClick={() => this.props.editModeToggle()}
          >
              Edit Post
          </button>
        </div>
      );

      totalBids = (
        <p
          onClick={() => this.props.toggleBidHistory('on')}
          className="red-underline text-right m-0"
        >
            Total Bids:
        </p>
      );
      totalBidsNumber = (
        <p
          onClick={() => this.props.toggleBidHistory('on')}
          className="red-underline m-0"
        >
          {this.props.totalBids}
        </p>
      );
    }

    let bidWindow = (
      <div
        className="bid-stats p-3"
        style={{ opacity: biddingClosed ? '40%' : '100%' }}
      >
        <p id="expire-disclaimer" className="text-center">
          All bids expire at 11:59 PST on expiration date
        </p>
        <div className="bid-numbers d-flex justify-content-between">
          <div className="text-right bid-numbers">
            <p className="text-right m-0">Highest Bid:</p>
            {totalBids}
            <p className="text-right m-0">Expires:</p>
          </div>
          <div className="bid-numbers">
            <p className="m-0">${formattedHighestBid}</p>
            {totalBidsNumber}
            <p
              className="m-0"
              style={{ color: biddingClosed ? 'red' : 'black' }}
            >
              {bidEnd}
            </p>
          </div>
        </div>
      </div>
    );

    if (biddingEnabled === false) {
      if (userId !== sellerId) {
        notesOrBid = (
          <div
            className="bid-buttons-container d-flex flex-column"
          >
            <button
              id="message"
              type="button"
              onClick={() => this.props.messageBtnClick()}
            >
              {' '}
          Message
            </button>
          </div>
        );

        bidWindow = (
          <div
            className="bid-stats p-3"
          >
            <p id="expire-disclaimer" className="text-center">
            The artist is not selling this artwork currently.
            </p>
          </div>
        );
      } else {
        bidWindow = (
          <div
            className="bid-stats p-3"
          >
            <p id="expire-disclaimer" className="text-center">
             You are not selling this artwork.
            </p>
          </div>
        );
      }
    }

    let modalDisplay = { display: 'none' };
    if (this.state.bidAlert) {
      modalDisplay = null;
    }

    return (
      <div className="description-bid-container">
        <div className="post-description">
          <p className="text-center">{description}</p>
        </div>
        <div className="post-bid-info d-flex align-items-center justify-content-between">
          {notesOrBid}
          {bidWindow}
        </div>
        {/* Modal */}
        <div className="new-post-modal" style={modalDisplay}>
          <div className="new-post-modal-content">
            {this.state.bidAlert}
            <div>
              <button
                onClick={() => {
                  this.setState({ bidAlert: null });
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
