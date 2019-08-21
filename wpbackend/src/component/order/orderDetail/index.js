import React, { Component } from "react";
import * as actions from "../../../action/orderAction";
import { connect } from "react-redux";

class OrderDetail extends Component {
  componentDidMount() {
    console.log(
      "OrderDetailComponent - didMount - props - ",
      this.props,
      Object.keys(this.props.viewOrder)
    );

    this.props.getOrderDetail(this.props.match.params.id);
  }
  componentDidCatch(error, info) {}

  render() {
    const DetailContent = (
      <tbody>
        {Object.keys(this.props.viewOrder)
          .filter(ele => ele !== "__v")
          .map((ele, idx) => {
            return (
              <tr>
                <td>{ele && ele}</td>
                <td>{this.props.viewOrder && this.props.viewOrder[ele]}</td>
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
      <div>
        <h2>OrderDetail</h2>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Detail</td>
            </tr>
          </thead>
          {DetailContent}
        </table>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getOrderDetail: e => {
      dispatch(actions.getOrderDetail(e));
    }
  };
};

const mapStateToProps = state => {
  const { order } = state;
  return {
    isFetching: order.isFetching,
    error: order.error,
    viewOrder: order.orders
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetail);
