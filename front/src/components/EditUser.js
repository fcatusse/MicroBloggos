import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
//import bcrypt from 'bcrypt-nodejs';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class EditUser extends React.Component {
  
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    if (cookies.get('token') === undefined) {
      this.props.history.push("/login");
    }
      this.state = {
        id: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        error: ""
      };
  }

	componentDidMount() {
		axios.post('http://localhost:8080/user/verifytoken', {token: this.props.cookies.get('token')} )
    .then( res => { 
      let id = res.data.id;
      if (id == null) {
        this.props.history.push("/login");
      }
      this.setState({
        id: id
      });
      axios.get('http://localhost:8080/user/'+id)
      .then( res => {
        this.setState({
          username: res.data.username,
          email: res.data.email,
        })
      });
    });
	}

  validateForm() {
    return this.state.username.length > 0 
    && this.state.email.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    if (this.state.password !== this.state.confirm_password) {
      this.setState({
        error: "Password doesn't match"
      });
      return this.state.error;
    }

    let body = {};
    if (this.state.password === "") {
      body = {
        username: this.state.username,
        email: this.state.email
      }
    } else {
      body = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      }
    }
    axios.put('http://localhost:8080/user/' + this.state.id + '/update', body)
		.then(res => {
      this.props.history.push("/login");
		});
  }

  render() {
    return (
      <div className="EditUser">
        <Link to={'/'}>Home</Link>
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
            Update
          </Button>
        </form>
      </div>
    );
  }
}

export default withCookies(EditUser);