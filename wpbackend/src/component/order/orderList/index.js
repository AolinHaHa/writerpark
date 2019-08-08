import React, { Component } from "react";
import * as actions from "../../../action/orderAction";
import { connect } from "react-redux";
import ReactTable from "react-table";

class OrderList extends Component {
  componentDidMount() {
    console.log("orderListComponent - props - ", this.props);
    this.props.getOrderList();
  }
  render() {
    if (this.props.isFetching) {
      return (
        <div>
          <h2>Loading Data</h2>
        </div>
      );
    }

    const orderList =
      this.props.orders.length > 0 &&
      this.props.orders.map((order, idx) => {
        return (
          <tr>
            <td>{order._id}</td>
            <td>{order.wpnumber}</td>
            <td>{order.referencenumber}</td>
            <td>{order.status}</td>
            <td>{order.deadline}</td>
            <td>{order.subject}</td>
            {/* <td>{order.topic}</td>
            <td>{order.instruction}</td> */}
            <td>{order.page}</td>
            {/* <td>{order.ppt}</td> */}
            <td>{order.rate}</td>
            <td>{order.supportingfile}</td>
            <td>{order.productionfile}</td>
            <td>{order.clientid}</td>
            <td>{order.amountcharged}</td>
            <td>{order.appliedcoupon}</td>
            <td>{order.assignedspecialty}</td>
          </tr>
        );
      });

    return (
      <div>
        <h2>WPorderListPage</h2>
        <table>
          <th>
            <tr>
              <td>ID</td>
              <td>WPREFERENCE</td>
              <td>CORP REFERENCE</td>
              <td>STATUS</td>
              <td>DEADLINE</td>
              <td>SUBJECT</td>
              <td>PAGE</td>
              <td>RATE</td>
              <td>ID</td>
              <td>WPREFERENCE</td>
              <td>CORP REFERENCE</td>
              <td>STATUS</td>
              <td>ID</td>
              <td>WPREFERENCE</td>
              <td>CORP REFERENCE</td>
              <td>STATUS</td>
            </tr>
          </th>
          {orderList}
        </table>
        {/* <h3>{this.props.order && this.props.order.orders}</h3> */}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getOrderList: () => {
      dispatch(actions.getOrderList());
    }
  };
};

const mapStateToProps = state => {
  const { order } = state;
  return {
    isFetching: order.isFetching,
    error: order.error,
    orders: order.orders
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList);
