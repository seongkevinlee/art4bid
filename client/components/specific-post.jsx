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
      <div>
        <header className="post-header text-center d-flex justify-content-around align-items-center">
          <div className="header-icon-container">
            <img
              onClick={() => this.props.setView('search')}
              className="header-icon" src="./images/kindpng.png"></img>
            <p></p>
          </div>
          <div>
            <p className="m-0">&ldquo;Vendetta&rdquo;</p>
            <p className="m-0">by</p>
            <p className="m-0">User</p>
          </div>
          <div className="header-icon-container text-center">
            <img className="header-icon" src="./images/fire-alt-solid.svg"></img>
            <p>watching</p>
          </div>
        </header>
        <section className="post-section">
          {/* <img className="post-image" src="https://i.picsum.photos/id/894/600/600.jpg?hmac=wJg2bcsTpfgAb0eYMLFbhzwiEUMTMBwtBf-yvdY491k"></img> */}
        </section>
      </div>
    );
  }
}
