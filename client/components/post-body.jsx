import React from 'react';

export default function PostBody(props) {
  const userId = props.userId;
  const sellerId = props.sellerId;
  let totalBids = <p className="text-right m-0">Total Bids:</p>;
  let totalBidsNumber = <p className="m-0">{props.totalBids}</p>;
  if (userId === sellerId) {
    totalBids = <p onClick={() => props.toggleBidHistory('on')} className="red-underline text-right m-0">Total Bids:</p>;
    totalBidsNumber = <p onClick={() => props.toggleBidHistory('on')} className="red-underline m-0">{props.totalBids}</p>;
  }

  return (
    <div>
      <div className="post-description">
        <p className="text-left">{props.description}</p>
      </div>
      <div className="post-bid-info d-flex align-items-center justify-content-between">
        <div className="bid-buttons-container d-flex flex-column">
          <input id="bid-offer" type="text" placeholder="$0" />
          <button id="submit-bid" type="button">Submit Bid</button>
          <button id="message" type="button" onClick={() => props.messageBtnClick()}> Message</button>
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
              <p className="m-0">${props.highestBid}</p>
              {totalBidsNumber}
              <p className="m-0">{props.bidEnd}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
