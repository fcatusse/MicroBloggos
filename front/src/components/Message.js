import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class Message extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
    
        const { cookies } = props;
        this.state = {
            id: "",
            username: ""
        };
    }

    componentDidMount() {
        axios.post('http://localhost:8080/user/verifytoken', {token: this.props.cookies.get('token')} )
        .then( res => { 
            let id = res.data.id;
            if (id != null) {
                this.setState({
                    id: id
                });
                axios.get('http://localhost:8080/user/'+id)
                .then( res => {
                    this.setState({
                    username: res.data.username
                    })
                });
            }
        });
    }

    logout= event => {
        event.preventDefault();
        this.props.cookies.remove("token");
        this.setState({
            id: "",
            username: ""
        });
    }

    render() {
        const {username} = this.state;
        return (
            <div>
                <h1>Homepage</h1>
                { username 
                ? <p>Welcome {username} (<a href="#" onClick={this.logout}>logout</a>)</p>
                : <Link to={'/login'}>Click here to login !</Link>
                }
            </div>
        );
    }
}

export default withCookies(Message); 