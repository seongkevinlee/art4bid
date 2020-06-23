import React from 'react';

export default class ThumbnailColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postThumbnails: []
    };
  }

  render() {
    return (
      <div className="flex-column thumbnail-column">
        <img className="w-100 contain" src="https://i.picsum.photos/id/51/600/600.jpg?hmac=wJi4zmJL9qrtlE5QRV9LR4gO8SQiTfYivU14RJG9Zbo"></img>
        <img className="w-100 contain" src="https://i.picsum.photos/id/822/200/200.jpg?hmac=pXgRn-rbZIan3GYBv9xCVsdyt_Kzq5Q_d0AbLnzeT3k"></img>
        <img className="w-100 contain" src="https://i.picsum.photos/id/703/200/200.jpg?hmac=6zWxIBRmIf2e0jZTqvKBIwrc7wm-dPkvGky4go6Yyvg"></img>
        <img className="w-100 contain" src="https://i.picsum.photos/id/402/200/200.jpg?hmac=9PZqzeq_aHvVAxvDPNfP6GuD58m4rilq-TUrG4e7V80"></img>
        <img className="w-100 contain" src="https://i.picsum.photos/id/969/200/200.jpg?hmac=p4_e12QQOwtyNXXwJjJs_2kwmu87KZGqAhiUV8goVos"></img>
        <img className="w-100 contain" src="https://i.picsum.photos/id/822/200/200.jpg?hmac=pXgRn-rbZIan3GYBv9xCVsdyt_Kzq5Q_d0AbLnzeT3k"></img>
        <img className="w-100 contain" src="https://i.picsum.photos/id/703/200/200.jpg?hmac=6zWxIBRmIf2e0jZTqvKBIwrc7wm-dPkvGky4go6Yyvg"></img>
        <img className="w-100 contain" src="https://i.picsum.photos/id/402/200/200.jpg?hmac=9PZqzeq_aHvVAxvDPNfP6GuD58m4rilq-TUrG4e7V80"></img>
      </div>

    );
  }

}
