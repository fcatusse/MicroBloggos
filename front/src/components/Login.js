import React from 'react';
import axios from 'axios';
import bcrypt from 'bcrypt-nodejs';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

	componentDidMount() {
		//
	}

	render() {
		return <div>
		{ 
			this.state.articles.map(article =>
				<div key={article.id}>
					<h2> {article.title}</h2>
					<p>{article.description}</p>
				</div>)
		}
		</div>;
	}

  //

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    console.log(this.state.email);
  }

  handleSubmit = event => {
    event.preventDefault();
    axios.get('http://localhost:8080/user/' + this.state.email + '/find')
		.then(res => {
  
      /*
      let salt = bcrypt.genSaltSync(128);
      var hash = bcrypt.hashSync(this.state.password, salt);
      console.log(hash);
      */

      let is_pwd_match = bcrypt.compareSync(this.state.password, res.data.password);
      if (is_pwd_match) {
        console.log('login !!!');
      } else {
        console.log('failed');
      }
      
		});
  }

  render() {
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
      </div>
    );
  }
}