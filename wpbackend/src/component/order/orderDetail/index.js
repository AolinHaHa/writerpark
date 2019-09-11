import React, { Component } from "react";
import * as actions from "../../../action/orderAction";
import { connect } from "react-redux";
import "../style.css";

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ orderHolder: nextProps.viewOrder });
  }
  componentDidMount() {
    // console.log("OrderDetailComponent - didMount - state - ", this.state);
    console.log(
      "OrderDetailComponent - didMount - props - ",
      this.props,
      Object.keys(this.props.viewOrder)
    );
    this.props.getOrderDetail(this.props.match.params.id);
  }
  componentDidCatch(error, info) {}

  render() {
    const { viewOrder } = this.props;
    const DetailContent = (
      <tbody>
        {Object.keys(this.props.viewOrder)
          .filter(ele => ele !== "supportingfiles")
          .map((ele, idx) => {
            return (
              <tr>
                <td>{ele && ele}</td>
                <td>{viewOrder && viewOrder[ele]}</td>
              </tr>
            );
          })}
      </tbody>
    );

    const FileManager = (
      <div className="OrderDetailFileManager">
        <div className="OrderDetailFileManagerLeft">
          <h4>SupportingFiles</h4>
          {viewOrder.supportingfiles &&
            viewOrder.supportingfiles.map(i => (
              <a href={"http://data:text;download;charset=utf-16;" + i.content}>
                {i.name}
              </a>
            ))}
          {/* viewOrder.supportingfiles.map(i => <a>{i.name}</a>)} */}
          {/* <p>{this.props}</p> */}
        </div>
        <div className="OrderDetailFileManagerRight">ProductionFiles</div>
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
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Detail</td>
            </tr>
          </thead>
          {DetailContent}
        </table>
        {FileManager}
        <div></div>
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
