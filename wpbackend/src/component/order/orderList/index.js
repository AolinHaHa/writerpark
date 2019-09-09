import React, { Component } from "react";
import * as actions from "../../../action/orderAction";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import TimeHelper from "../../../common/helper/timeHelper";
import "../style.css";
// import history from "../../../history";
// import { Redirect } from "react-router-dom";
// import ReactTable from "react-table";

class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = { currentQuery: "" };
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleButtonRelease = this.handleButtonRelease.bind(this);
  }
  componentDidMount() {
    console.log("orderListComponent - props - ", this.props);
    console.log("orderListComponent - states - ", this.state);
    this.props.getOrderList({ query: this.state.currentQuery });
  }

  pageHandler(e) {
    this.props.getOrderList({ page: e });
  }

  goto = (e, orderId) => {
    if (e.detail === 2) {
      this.props.history.push({
        pathname: "/order/" + orderId
      });
    }
  };

  handleButtonPress(content) {
    this.buttonPressTimer = setTimeout(() => {
      navigator.clipboard
        .writeText(content)
        .then(
          this.props.enqueueSnackbar(content + " Copied", {
            variant: "success"
          })
        )
        .catch(err =>
          this.props.enqueueSnackbar(err, {
            variant: "error"
          })
        );
    }, 500);
  }

  handleButtonRelease() {
    clearTimeout(this.buttonPressTimer);
  }

  searchOnChangeHandler = e => {
    // console.log(e.target.value);
    e.preventDefault();
    this.setState({ currentQuery: e.target.value });
  };

  sortTable = (e, field) => {
    this.props.getOrderList({ sort: "-" + field });
    // if (e.detail === 2) {
    //   this.props.getOrderList({ sort: field });
    // } else if (e.detail === 1) {
    //   this.props.getOrderList({ sort: "-" + field });
    // }
  };

  search = () => {
    this.props.getOrderList({ query: this.state.currentQuery });
    this.setState({ currentQuery: "" });
  };

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
            <td
              onClick={e => this.goto(e, order._id)}
              onMouseDown={() => this.handleButtonPress(order._id)}
              onMouseUp={this.handleButtonRelease}
            >
              {order._id}
            </td>
            <td
              onMouseDown={() => this.handleButtonPress(order.wpnumber)}
              onMouseUp={this.handleButtonRelease}
            >
              {order.wpnumber}
            </td>
            {/* <td>{order.referencenumber}</td> */}
            <td>{order.status}</td>
            <td>{TimeHelper.FormatTimeStamp(order.deadline, "lll")}</td>
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
      <div className="OrderListContainer">
        {/* <h2>WPorderListPage</h2> */}
        <div className="OrderListSearchBar">
          <input
            placeholder="search"
            onChange={e => this.searchOnChangeHandler(e)}
          />
          <button onClick={() => this.search()}>Search</button>
        </div>

        <div className="OrderListTableWrapper">
          <table className="OrderListTable">
            <thead>
              <tr>
                <td>ID</td>
                <td>WP Reference</td>
                {/* <td>Corp Reference</td> */}
                <td>Status</td>
                <td onClick={e => this.sortTable(e, "deadline")}>Deadline</td>
                <td>Subject</td>
                <td>Page</td>
                <td>Rate</td>
                <td>Client ID</td>
                <td>Charged Amount</td>
                <td>Applied Coupon</td>
                <td>Assigned Speciality</td>
              </tr>
            </thead>

            <tbody>{orderList}</tbody>
          </table>
        </div>

        <div className="orderListControlPanel">
          <button
            onClick={() => this.pageHandler(this.props.orders.prevPage)}
            disabled={!this.props.orders.hasPrevPage}
          >
            Prev
          </button>
          <p>{this.props.orders.page}</p>
          <button
            onClick={() => this.pageHandler(this.props.orders.nextPage)}
            disabled={!this.props.orders.hasNextPage}
          >
            Next
          </button>
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
export default withSnackbar(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderList)
);
