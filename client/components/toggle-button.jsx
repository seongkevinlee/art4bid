import React from 'react';

export default class ToggleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { biddingEnabled: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (!this.state.biddingEnabled) {
      this.setState({ biddingEnabled: true });
    } else {
      this.setState({ biddingEnabled: false });
    }
    this.props.isEnabled();
  }

  render() {
    const { biddingEnabled } = this.state;

    return (
      <div>
        <div
          className={biddingEnabled ? 'oval-red' : 'oval'}
          onClick={this.handleClick}
        >
          <span>
            {biddingEnabled ? (
              <p className="bidding-enabled">Bidding Enabled</p>
            ) : (
              <p className="bidding-disabled">Bidding Disabled</p>
            )}
          </span>
          <div
            className={biddingEnabled ? 'slider-left' : 'slider-right'}
            onClick={this.handleClick}
          ></div>
        </div>
      </div>
    );
  }
}
