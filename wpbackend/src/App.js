import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "./history";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import Home from "./component/home";
import OrderList from "./component/order/orderList";
import OrderDetail from "./component/order/orderDetail";
import Header from "./common/header";
import Footer from "./common/footer";
// import customRouter from "./common/router";

// function App() {
//   return <customRouter />;
// }

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div className="main-container">
            <Header />
            <div className="body">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/order" component={OrderList} />
                <Route exact path="/order/:id" component={OrderDetail} />
              </Switch>
            </div>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
