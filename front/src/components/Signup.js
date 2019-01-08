import React from 'react';
import axios from 'axios';
import bcrypt from 'bcrypt-nodejs';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      confirm_password: ""
    };
  }

	componentDidMount() {
		//
	}

  validateForm() {
    return this.state.username.length > 0 
    && this.state.email.length > 0 
    && this.state.password.length > 0
    && this.state.confirm_password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.password != this.state.confirm_password) {
      this.setState({
        error: "Password doesn't match"
      });
      return this.state.error;
    }

    let body = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    }
    axios.post('http://localhost:8080/user/signup', body)
		.then(res => {
      console.log("Redirect");
      this.props.history.push("/login");
		});
  }

  render() {
    return (
      <div className="Signup">
        <p>{this.state.success}</p>
        <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Username</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.username}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
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
          <FormGroup controlId="confirm_password" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.confirm_password}
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
      </div>
    );
  }
}

export default (Signup);