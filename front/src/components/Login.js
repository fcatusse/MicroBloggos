import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
//import bcrypt from 'bcrypt-nodejs';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Login extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

	componentDidMount() {
		//
	}

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    let body = {
      email: this.state.email,
      password: this.state.password
    }
    axios.post('http://localhost:8080/user/login', body)
		.then(res => {
      const { cookies } = this.props;
      cookies.set('token', res.data.token, { path: '/' });
      this.props.history.push("/");
		});
  }

  render() {
    if (this.props.cookies.get('token')) {
      this.props.history.push("/");
    }
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
        <Link to={'/signup'}>Click here to sign up !</Link>
      </div>
    );
  }
}

export default withCookies(Login);