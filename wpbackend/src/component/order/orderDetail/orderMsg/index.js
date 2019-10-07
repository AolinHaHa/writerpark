import React, { Component } from "react";
import * as actions from "../../../../action/orderAction";
import { connect } from "react-redux";

class OrderMsg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newMessage: { content: null, from: "testUser", time: null }
    };
  }

  componentDidMount() {
    console.log("OrderMsg - didMount - props - ", this.props, this.state);
  }

  newMsgOnChange = e => {
    e.preventDefault();
    const value = e.target.value;
    this.setState(prevState => ({
      newMessage: {
        ...prevState.newMessage,
        content: value,
        time: Date.now()
      }
    }));
    // console.log(e.target.value, this.state.newMessage.content);
  };

  onNewMsgClick = () => {
    const { currentOrderMsg, currentOrderId } = this.props;
    console.log(this.state.newMessage);
    let holder = currentOrderMsg;
    let requestBody = {};
    let newMsg = this.state.newMessage;
    holder.push(newMsg);
    requestBody["order_id"] = currentOrderId;
    requestBody["message"] = holder;
    console.log("requestBody - onNewMsgClick - ", requestBody);
    this.props.createOrderNewMsg(requestBody);
  };

  render() {
    const { currentOrderMsg } = this.props;

    if (this.props.isFetching) {
      return (
        <div>
          <h2>Loading Data</h2>
        </div>
      );
    }

    return (
      <div className="orderMsg">
        <h4>Order Message</h4>
        {currentOrderMsg &&
          currentOrderMsg.map(singleMsg => (
            <div>
              <span>content {singleMsg.content}</span>
              <span>from {singleMsg.from}</span>
              <span>time {singleMsg.time}</span>
            </div>
          ))}
        <input
          placeholder="new msg"
          onChange={e => this.newMsgOnChange(e)}
          value={this.state.newMessage.content}
        ></input>

        <button onClick={() => this.onNewMsgClick()}>Send</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createOrderNewMsg: msg => {
      dispatch(actions.createOrderNewMsg(msg));
    }
  };
};

const mapStateToProps = state => {
  const { auth } = state;
  return {
    currentUser: auth.currentUser
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderMsg);
