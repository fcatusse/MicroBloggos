import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class UsersList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }

    componentWillReceiveProps() {
        console.log("depuis UsersList : ",this.props.user_id);
        axios.get('http://localhost:8080/user/')
        .then( res => {
            this.setState({
                users: res.data.users
            })
        });
    }

    render() {
        return (
            <p>je suis UsersList.js !</p>
    
        );
    }
}

export default UsersList;
