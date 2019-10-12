import React, { Component } from "react";
import * as actions from "../../../action/orderAction";
import { connect } from "react-redux";
import FileManager from "./fileManager";
import OrderLog from "./orderLog";
import OrderMsg from "./orderMsg";
import "../style.css";

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //save props to state
  componentWillReceiveProps(nextProps) {
    this.setState({ currentOrder: nextProps.currentOrder });
  }
  componentDidMount() {
    console.log(
      "OrderDetailComponent - didMount - props - ",
      this.props,
      this.state
      // Object.keys(this.props.currentOrder)
    );
    this.props.getOrderDetail(this.props.match.params.id);
  }

  // componentDidCatch(error, info) {}

  inputUserNameHandler = e => {
    e.preventDefault();
    this.setState({ account: e.target.value });
  };

  render() {
    const { currentOrder } = this.props;
    const DetailContent = (
      <tbody>
        {Object.keys(this.props.currentOrder)
          .filter(
            ele =>
              ["supportingfiles", "log", "__v", "message"].includes(ele) ===
              false
          )
          .map(ele => {
            return (
              <tr key={ele}>
                <td>{ele}</td>
                <td>{currentOrder[ele]}</td>
              </tr>
            );
          })}
      </tbody>
    );

    console.log("OrderDetailComponent - props - ", this.props);
    if (this.props.isFetching) {
      return (
        <div>
          <h2>Loading Data</h2>
        </div>
      );
    }

    return (
      <div className="OrderDetail">
        <h2>OrderDetail</h2>
        <table>
          <thead>
            <tr>
              <td>Key</td>
              <td>Value</td>
            </tr>
          </thead>
          {DetailContent}
        </table>
        <OrderLog
          currentOrderLog={this.props.currentOrder.log}
          currentOrderId={this.props.currentOrder._id}
        />
        <OrderMsg
          currentOrderMsg={this.props.currentOrder.message}
          currentOrderId={this.props.currentOrder._id}
        />
        <FileManager currentOrderId={this.props.currentOrder._id} />
        <button onClick={() => this.updateOrderHandler()}>Update Order</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getOrderDetail: order => {
      dispatch(actions.getOrderDetail(order));
    },
    updateOrder: order => {
      dispatch(actions.updateOrder(order));
    }
  };
};

const mapStateToProps = state => {
  const { order } = state;
  return {
    isFetching: order.isFetching,
    error: order.error,
    currentOrder: order.currentOrder
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetail);
