import React from 'react';
import MessageHeader from './message-header';
import MessageList from './message-list';
import MessageDetail from './message-detail';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      originalMessages: [],
      isFirstSearch: true,
      detailMessages: [],
      isMessageDetail: false,
      postId: null,
      senderId: null,
      isReceived: true,
      recipientId: null,
      isSearch: false,
      keyword: null
    };
    this.getMessageList = this.getMessageList.bind(this);
    this.getSentMessageList = this.getSentMessageList.bind(this);
    this.getTimeMsg = this.getTimeMsg.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleViewMessageClick = this.handleViewMessageClick.bind(this);
    this.searchKeyword = this.searchKeyword.bind(this);
    this.viewMessageDetail = this.viewMessageDetail.bind(this);
    this.searchToggle = this.searchToggle.bind(this);
    this.textBolder = this.textBolder.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const { userInfo } = this.props;
    this.getMessageList(userInfo.userId);
  }

  getMessageList(userId) {
    this.setState({
      isReceived: true
    });
    const body = { recipientId: userId };
    fetch('/api/message/list/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(messages => {
        if (messages.error) {
          // eslint-disable-next-line no-console
          console.log(messages.error);
        }
        this.setState({
          messages
        });
      });
  }

  getSentMessageList(userId) {
    this.setState({
      isReceived: false
    });
    const body = { senderId: userId };
    fetch('/api/message/list/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(messages => {
        if (messages.error) {
          // eslint-disable-next-line no-console
          console.log(messages.error);
        }
        this.setState({
          messages: messages
        });
      });
  }

  viewMessageDetail(senderId, postId, recipientId) {
    const body = {
      recipientId: recipientId,
      senderId: senderId,
      postId: postId
    };
    fetch('/api/message/detail/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(messages => {
        if (messages.error) {
          // eslint-disable-next-line no-console
          console.log(messages.error);
        }
        this.setState({
          detailMessages: messages
        });
      });
  }

  sendMessage(message) {
    const { postId, senderId } = this.state;
    const { userInfo } = this.props;
    const { userName, userId } = userInfo;
    const sendMsg = {
      senderName: userName,
      senderId: userId,
      recipientId: senderId,
      postId: postId,
      message: message,
      createdAt: new Date()
    };
    if (message.length < 1) {
      this.showMessage('please type your message', 1000);
    } else {
      fetch('/api/message/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendMsg)
      })
        .then(res => res.json())
        .then(data => {
          this.setState({
            detailMessages: [...this.state.detailMessages, sendMsg]
          });
        })
        .catch(err => console.error(err.message));
    }
  }

  handleBackClick() {
    this.setState({
      isMessageDetail: false,
      isFirstSearch: true,
      isSearch: false,
      messages: this.state.originalMessages
    });
    const { userInfo } = this.props;
    this.getMessageList(userInfo.userId);
  }

  searchToggle() {
    this.setState({
      isSearch: !this.state.isSearch
    });
  }

  searchKeyword(keyword) {
    let arr = [];
    const { isFirstSearch, isMessageDetail } = this.state;
    if (isFirstSearch) {
      arr = isMessageDetail ? [...this.state.detailMessages] : [...this.state.messages];
      this.setState({
        originalMessages: arr,
        isFirstSearch: false
      });
    } else {
      arr = [...this.state.originalMessages];
    }
    const newArr = arr.filter(obj => {
      if (isMessageDetail) {
        return obj.message.toLowerCase().includes(keyword.toLowerCase());
      } else {
        return obj.senderName.toLowerCase().includes(keyword.toLowerCase());
      }
    });
    if (isMessageDetail) {
      this.setState({
        detailMessages: newArr,
        keyword
      });
    } else {
      this.setState({
        messages: newArr,
        keyword
      });
    }
  }

  handleViewMessageClick() {
    const senderId = event.target.id.split(',')[0];
    const senderName = event.target.id.split(',')[1];
    const postId = event.target.id.split(',')[2];
    const recipientId = event.target.id.split(',')[3];
    this.setState({
      postId: postId,
      senderId: senderId,
      senderName: senderName,
      recipientId: recipientId,
      messages: this.state.originalMessages
    });
    this.viewMessageDetail(senderId, postId, recipientId);
    this.setState({
      isMessageDetail: true,
      isFirstSearch: true,
      isSearch: false
    });
  }

  textBolder(text, boldStr) {
    const keyword = new RegExp(boldStr, 'i');
    const array = text.split(keyword);
    const keyIndex = text.toLowerCase().indexOf(boldStr.toLowerCase());
    const originalKeyword = text.substring(keyIndex, keyIndex + boldStr.length);
    return (
      <>
        {array.map((item, index) => (
          <span key={index}>
            {item}
            {index !== array.length - 1 && (
              <b className="text-dark bg-warning">{originalKeyword}</b>
            )}
          </span>
        ))}
      </>
    );
  }

  getTimeMsg(createdAt) {
    const createdTime = new Date(createdAt);
    const currentTime = new Date();
    let diff = (currentTime - createdTime) / 1000;

    const second = 1;
    const minute = 60;
    const hour = 60;
    const day = 24;
    const month = 30;
    const year = 12;

    let divider = second;
    let timeMsg = 'minutes';

    if (diff < 60 * second) {
      divider = second;
      timeMsg = 'second';
    } else if (diff < 60 * second * minute) {
      divider = second * minute;
      timeMsg = 'minute';
    } else if (diff < 60 * second * minute * hour) {
      divider = second * minute * hour;
      timeMsg = 'hour';
    } else if (diff < 60 * second * minute * hour * day) {
      divider = second * minute * hour * day;
      timeMsg = 'day';
    } else if (diff < 60 * second * minute * hour * day * month) {
      divider = second * minute * hour * day * month;
      timeMsg = 'month';
    } else if (diff < 60 * second * minute * hour * day * month * year) {
      divider = second * minute * hour * day * month * year;
      timeMsg = 'month';
    }

    diff /= divider;

    const displayTime = Math.abs(Math.round(diff));
    const plural = displayTime > 1 ? 's' : '';
    const timeMessage = `${displayTime} ${timeMsg}${plural} ago`;
    return timeMessage;
  }

  render() {
    const { userInfo } = this.props;
    const {
      handleBackClick,
      getTimeMsg,
      handleViewMessageClick,
      getMessageList,
      searchKeyword,
      viewMessageDetail,
      sendMessage,
      searchToggle,
      textBolder
    } = this;
    const {
      messages,
      detailMessages,
      isMessageDetail,
      senderId,
      senderName,
      postId,
      recipientId,
      isSearch,
      keyword
    } = this.state;
    return (
      <div>
        <MessageHeader
          postId={postId}
          userInfo={userInfo}
          senderId={senderId}
          senderName={senderName}
          isMessageDetail={isMessageDetail}
          handleBackClick={handleBackClick}
          getMessageList={getMessageList}
          searchKeyword={searchKeyword}
          detailMessages={detailMessages}
          isSearch={isSearch}
          searchToggle={searchToggle}
        />
        {isMessageDetail
          ? (<MessageDetail
            getTimeMsg={getTimeMsg}
            userInfo={userInfo}
            postId={postId}
            senderId={senderId}
            recipientId={recipientId}
            viewMessageDetail={viewMessageDetail}
            sendMessage={sendMessage}
            detailMessages={detailMessages}
            keyword={keyword}
            textBolder={textBolder}
          />
          )
          : (<MessageList
            messages={messages}
            userInfo={userInfo}
            getTimeMsg={getTimeMsg}
            handleViewMessageClick={handleViewMessageClick}
            keyword={keyword}
            textBolder={textBolder}
          />
          )
        }
      </div>
    );
  }
}
