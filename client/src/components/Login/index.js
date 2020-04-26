import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
//import {userLoginFetch} from '../../utils/actions';
import {
  Link
} from 'react-router-dom';

class Login extends Component {
  state = {
    email: "",
    password: ""
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault()
    //this.props.userLoginFetch(this.state)
    this.loginTask()
  }

  loginTask = () => {
    fetch("http://localhost:3001/api/v1/login", {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(this.state)
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        if (data.message) {

        } else {
          localStorage.setItem("token", data.token)
          console.log("success login");
          this.props.history.push('/r/');
        }
      })
  }

  render() {
    return (
      <div className="container">
          <form onSubmit={this.handleSubmit} className="pt-5">
              <h2 className="text-center">Log in</h2>
              <div className="form-group pt-5">
                  <input type="text"
                    className="form-control"
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
              </div>
              <div className="form-group">
                  <input type="password"
                    className="form-control"type='password'
                    name='password'
                    placeholder='Password'
                    value={this.state.password}
                    onChange={this.handleChange} />
              </div>
              <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">Log in</button>
              </div>
          </form>
          <div className="pt-5 text-center">
               <Link to="/">
                 Go back
               </Link>
          </div>
    </div>
    )
  }
}

// const mapDispatchToProps = dispatch => ({
//   userLoginFetch: userInfo => dispatch(userLoginFetch(userInfo))
// })

export default Login
