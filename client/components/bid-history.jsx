import React from 'react';

export default class BidHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bids: []
    };
    this.getBids = this.getBids.bind(this);
  }

  componentDidMount() {
    this.getBids(this.props.postId);
  }

  getBids(postId) {
    fetch(`/api/bidhistory/${postId}`)
      .then(res => res.json())
      .then(bids => this.setState({ bids }));
  }

  render() {
    const { bids } = this.state;
    let bidRow;
    let noBid;
    if (bids.length > 0) {
      bidRow = (
        bids.map(bid => {
          return (
            <tr key={bid.bidId}>
              <td>{bid.bidId}</td>
              <td>{bid.userName}</td>
              <td>{new Date(bid.createdAt).toLocaleString().split(',')[0] + ' |' + new Date(bid.createdAt).toLocaleString().split(',')[1]}</td>
              <td>{`$${bid.currentBid}`}</td>
            </tr>
          );
        })
      );
    } else {
      noBid = <p id="no-bid">There are no bids.</p>;
    }
    return (
      <div className="bid-history text-center">
        <header>
          <div className="bid-back-icon-container cursor-pointer">
            <img alt="" onClick={() => this.props.toggleBidHistory('off')} className="bid-back-icon" src="./images/kindpng.png"></img>
          </div>
          <p id="bid-history" className="mb-1">Bid History</p>
        </header>
        <div className="bid-table">
          <table>
            <thead>
              <tr>
                <th>Bid ID</th>
                <th>Username</th>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {bidRow}
            </tbody>
          </table>
          {noBid}
        </div>
      </div>

    );
  }

}
