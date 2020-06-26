import React from 'react';

export default class PostBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highestBid: null,
      submittedBid: ''
    };
    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmid.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ submittedBid: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    // console.log('it works');
  }

  render() {
    const userId = this.props.userId;
    const sellerId = this.props.sellerId;
    let totalBids = <p className="text-right m-0">Total Bids:</p>;
    let totalBidsNumber = <p className="m-0">{this.props.totalBids}</p>;
    if (userId === sellerId) {
      totalBids = <p onClick={() => this.props.toggleBidHistory('on')} className="red-underline text-right m-0">Total Bids:</p>;
      totalBidsNumber = <p onClick={() => this.props.toggleBidHistory('on')} className="red-underline m-0">{this.props.totalBids}</p>;
    }
    return (
      <div>
        <div className="post-description">
          <p className="text-left">{this.props.description}</p>
        </div>
        <div className="post-bid-info d-flex align-items-center justify-content-between">
          <div className="bid-buttons-container d-flex flex-column">

            <form>
              <input
                name="bid-offer"
                id="bid-offer"
                type="text"
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
          </div>
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
