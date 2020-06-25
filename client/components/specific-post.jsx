import React from 'react';

export default class SpecificPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileInfo: null
    };
  }

  render() {
    return (
      <div className="indiv-post">
        <header className="post-header text-center d-flex justify-content-between align-items-center pl-3 pr-3">
          <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
            <img
              onClick={() => this.props.setView('search')}
              className="header-icon" src="./images/kindpng.png"></img>
            <p className="following m-0 invisible">go back</p>
          </div>
          <div className="post-header-text">
            <p id="post-name" className="mb-1">&ldquo;Vendetta&rdquo;</p>
            <p id="by" className="mb-1">by</p>
            <p className="m-0">User</p>
          </div>
          <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
            <img className="header-icon" src="./images/fire-alt-solid.svg"></img>
            <p className="following m-0"><span>420</span> Watching</p>
          </div>
        </header>
        <div className="post-body">
          <div className="post-image-container">
            <img src="https://i.pinimg.com/originals/29/46/77/294677fbd23047a3c4096b37999e87df.jpg"></img>
          </div>
          <div className="post-description m-auto">
            <p className="text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie urna euismod tortor tempor, quis vestibulum mauris ultricies. Sed lacus sem, euismod in luctus ac, ornare vitae massa. Etiam ultrices nisl ac ipsum molestie, id mattis metus ultrices. In semper auctor nisi vel rhoncus. Nunc arcu nisl, porttitor vitae lectus ut, convallis lacinia sem. Vestibulum vel euismod ipsum, eget vestibulum felis.</p>
          </div>
        </div>
        <div className="post-bid-info d-flex align-items-center justify-content-between m-0">
          <div className="bid-buttons-container d-flex flex-column">
            <input id="bid-offer" type="text" placeholder="$80.00" />
            <button id="submit-bid" type="button">Submit Bid</button>
            <button id="message" type="button"> Message</button>
          </div>
          <div className="bid-stats p-3">
            <p id="expire-disclaimer" className="text-center">All bids expire at 12AM PST on expiration date</p>
            <div className="bid-numbers d-flex justify-content-between">
              <div className="text-right bid-numbers">
                <p className="text-right m-0">Highest Bid:</p>
                <p className="text-right m-0">Total Bids:</p>
                <p className="text-right m-0">Expires:</p>
              </div>
              <div className="bid-numbers">
                <p className="m-0">$72.00</p>
                <p className="m-0">7</p>
                <p className="m-0">4/20/20</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
