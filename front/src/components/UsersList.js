import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class UsersList extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
        this.subscribe = this.subscribe.bind(this);
    }

    componentWillMount() {
        axios.get('http://localhost:8080/user/')
        .then( res => {
            this.setState({
                users: res.data
            })
        });
    }

    subscribe(event) {
        event.preventDefault();
        let id = event.target.id;
        axios.put('http://localhost:8080/user/'+this.props.user_id+'/subscribe', {id: id})
        .then( res => {
        });
    }

    render() {
        return (
            <div className="UsersList">
                <h3>Users List</h3>
                <ul>
                {
                    this.state.users.map(user => {
                        let path = '/'+user.username; 
                        return (
                            <li key={user._id}>
                                <Link to={path}>{user.username}</Link>
                                { (user._id !== this.props.user_id)
                                    ? 
                                <button id={user._id} onClick={this.subscribe}>Susbscribe</button>
                                    :
                                <span></span>
                                }
                            </li>                     
                        )
                    })
                }
                </ul>
            </div>
        );
    }
}

export default UsersList;
