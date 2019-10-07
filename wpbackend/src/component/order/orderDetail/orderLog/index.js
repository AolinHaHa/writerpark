import React, { Component } from "react";
import * as actions from "../../../../action/orderAction";
import { connect } from "react-redux";

class OrderLog extends Component {
  constructor(props) {
    super(props);
    this.state = { content: null, priority: 1 };
  }

  componentDidMount() {
    console.log(
      "OrderLogComponent - didMount - props - ",
      this.props,
      this.state
    );
  }

  newLogOnChange = e => {
    e.preventDefault();
    this.setState({ content: e.target.value });
  };

  priorityOnChange = e => {
    e.preventDefault();
    this.setState({ priority: e.target.value });
  };

  onNewLogClick = () => {
    const { currentOrderLog, currentOrderId } = this.props;
    let holder = currentOrderLog;
    let requestBody = {};
    let newLog = this.state;
    holder.push(newLog);
    requestBody["order_id"] = currentOrderId;
    requestBody["orderLog"] = holder;
    // console.log("requestBody - onNewMsgClick - ", requestBody);
    this.props.createOrderNewLog(requestBody);
    this.props.getOrderDetail(currentOrderId);
  };

  render() {
    const { currentOrderLog } = this.props;

    if (this.props.isFetching) {
      return (
        <div>
          <h2>Loading Data</h2>
        </div>
      );
    }

    return (
      <div className="orderLog">
        <div className="orderLogs">
          <h4>Order Log</h4>
          {currentOrderLog &&
            currentOrderLog.map(singleLog => (
              <div key="singleLog">
                <p>{singleLog.content}</p>
                <p>priority {singleLog.priority}</p>
              </div>
            ))}
        </div>

        <input
          placeholder="new log"
          onChange={e => this.newLogOnChange(e)}
          value={this.state.content}
        ></input>
        <select value={this.state.priority} onChange={this.priorityOnChange}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
        <button onClick={() => this.onNewLogClick()}>add</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createOrderNewLog: log => {
      dispatch(actions.createOrderNewLog(log));
    },
    getOrderDetail: order_id => {
      dispatch(actions.getOrderDetail(order_id));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(OrderLog);
