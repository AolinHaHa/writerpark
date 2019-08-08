import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "react-private-route";
import Home from "../../component/home";
import orderList from "../../component/order/orderList";

class customRouter extends Component {
  render() {
    return (
      <Router>
        <div className={"main-container"}>
          <Switch>
            <Route path="/home" component={Home} />
            <PrivateRoute
              exact
              path="/order"
              component={orderList}
              isAuthenticated={true}
            />
            {/* <Route component={NotFound} /> */}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default customRouter;
