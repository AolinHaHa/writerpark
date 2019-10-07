import React, { Component } from "react";
import * as actions from "../../action/authAction";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { account: null, password: null };
  }

  inputUserNameHandler = e => {
    e.preventDefault();
    this.setState({ account: e.target.value });
  };
  inputPassWordHandler = e => {
    e.preventDefault();
    this.setState({ password: e.target.value });
  };

  login = e => {
    // console.log(e);
    this.props.login({
      account: this.state.account,
      password: this.state.password
    });
  };

  render() {
    return (
      <div>
        <h2>WPLoginPage</h2>
        <input
          placeholder="enter user name"
          onChange={e => this.inputUserNameHandler(e)}
        ></input>
        <input
          placeholder="enter password"
          onChange={e => this.inputPassWordHandler(e)}
        ></input>
        <button onClick={() => this.login()}>Login</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: e => {
      dispatch(actions.login(e));
    }
  };
};

const mapStateToProps = state => {
  const { auth } = state;
  return {
    isFetching: auth.isFetching,
    error: auth.error,
    passAuth: auth.passAuth
  };
};
export default withSnackbar(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
