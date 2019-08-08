import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Header extends Component {
  render() {
    return (
      <div className="header">
        <ul>
          <li>
            <Link to={{ pathname: "/" }}>HOME</Link>
          </li>
          <li>
            <Link to={{ pathname: "/order" }}>ORDERS</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Header;
