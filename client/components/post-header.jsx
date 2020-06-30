import React from 'react';
import { FireAltIcon } from '../assets/Svg';

export default function PostHeader(props) {

  return (
    <header className="post-header text-center d-flex justify-content-between align-items-center pl-3 pr-3">
      <div className="header-icon-container d-flex flex-column justify-content-center mt-2">
        <div
          className='back-container text-center d-flex justify-content-start align-items-center'
        >
          <img
            type='button'
            className="back-arrow"
            src="./images/backarrow.png"
            alt="back-arrow"
            onClick={() => props.setView(props.previousView)} />
        </div>
        <p className="following m-0 invisible">go back</p>
      </div>
      <div className="post-header-text">
        <p id="post-name" className="mb-1">
          &ldquo;{props.title}&rdquo;
        </p>
        <p id="by" className="mb-1">
          by
        </p>
        <p className="m-0">{props.userName}</p>
      </div>
      <div
        className="header-icon-container d-flex flex-column justify-content-center mt-2"
        onClick={() => { props.addToWatchlist(); }}
      >
        <FireAltIcon
          isWatchlisted={props.isWatchlisted}
        />
        <p className="following mt-2 mb-0">
          <span>{props.watchlist}</span> Watching
        </p>
      </div>
    </header>
  );
}
