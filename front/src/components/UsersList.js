import React from 'react';
import axios from 'axios';
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class UsersList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentWillMount() {
        axios.get('http://localhost:8080/user/')
        .then( res => {
            this.setState({
                users: res.data
            })
        });
    }

    render() {
        return (
            <div className="UsersList">
                <h3>Users List</h3>
                <ul>
                {
                    this.state.users.map(user => {
                        let path = '/'+user._id; 
                        return (
                            <div className="User" key={user._id}>
                                <li><a href={path}>{user.username}</a></li>
                            </div>                            
                        )
                    })
                }
                </ul>
            </div>
        );
    }
}

export default UsersList;
