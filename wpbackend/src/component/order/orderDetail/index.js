import React, { Component } from "react";
import * as actions from "../../../action/orderAction";
import { connect } from "react-redux";

class OrderDetail extends Component {
  componentDidMount() {
    console.log("OrderDetailComponent - props - ", this.props);
    this.props.getOrderDetail(this.props.match.params.id);
  }

  render() {
    const DetailContent = (
      <div>
        {Object.keys(this.props.viewOrder).map((ele, idx) => {
          return (
            <div className={ele === "__v" && "noneDisplay"}>
              {/* <div {ele === "__v" && className="noneDisplay"}> */}
              <p>{ele}</p>
              <p>{this.props.viewOrder[ele]}</p>
            </div>
          );
        })}
      </div>
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
        {DetailContent}
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
