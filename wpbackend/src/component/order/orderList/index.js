import React, { Component } from "react";
import * as actions from "../../../action/orderAction";
import { connect } from "react-redux";
import history from "../../../history";
import { Redirect } from "react-router-dom";
import ReactTable from "react-table";

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = { currentQuery: "" };
  }
  componentDidMount() {
    console.log("orderListComponent - props - ", this.props);
    this.props.getOrderList();
  }

  pageHandler(e) {
    this.props.getOrderList({ page: e });
  }

  goto = orderId => {
    this.props.history.push({
      pathname: "/order/" + orderId
    });
    // return <Redirect to={"/order/" + orderId} />;
  };

  search = searchQuery => {
    this.setState({ currentQuery: searchQuery });
  };

  searchQuery() {
    this.props.getOrderList({ query: this.state.currentQuery });
  }

  render() {
    console.log("orderListComponent - props - ", this.props);
    if (this.props.isFetching) {
      return (
        <div>
          <h2>Loading Data</h2>
        </div>
      );
    }

    const orderList =
      this.props.orders &&
      this.props.orders.docs &&
      this.props.orders.docs.length > 0 &&
      this.props.orders.docs.map((order, idx) => {
        return (
          <tr>
            <td onClick={() => this.goto(order._id)}>{order._id}</td>
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
            {/* <td>{order.supportingfile}</td>
            <td>{order.productionfile}</td> */}
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
        <input
          placeholder="search"
          onChange={e => this.search(e.target.value)}
        />
        <button onClick={() => this.searchQuery()}>Search</button>
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>WPREFERENCE</td>
              <td>CORP REFERENCE</td>
              <td>STATUS</td>
              <td>DEADLINE</td>
              <td>SUBJECT</td>
              <td>PAGE</td>
              <td>RATE</td>
              <td>CLIENT_ID</td>
              <td>CHARGED_AMOUNT</td>
              <td>APPLIED_COUPON</td>
              <td>ASSIGNED_SPECIALTY</td>
            </tr>
          </thead>

          <tbody>{orderList}</tbody>
        </table>
        <div className="orderListControlPanel">
          {this.props.orders.hasNextPage && (
            <button
              onClick={() => this.pageHandler(this.props.orders.nextPage)}
            >
              +
            </button>
          )}
          <h3>{this.props.orders.page}</h3>
          {this.props.orders.hasPrevPage && (
            <button
              onClick={() => this.pageHandler(this.props.orders.prevPage)}
            >
              -
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getOrderList: e => {
      dispatch(actions.getOrderList(e));
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
