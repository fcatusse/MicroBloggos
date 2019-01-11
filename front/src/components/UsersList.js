import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class UsersList extends React.Component {
    
    constructor(props) {
        super(props);
        console.log("ICI")
        console.log(this.props)

        this.state = {
            users: [],
            subscriptions_id: []
        };
        this.subscribe = this.subscribe.bind(this);
    }

    componentWillReceiveProps() {
        axios.get('http://localhost:8080/user/')
        .then( res => {
            this.setState({
                users: res.data
            })
            let bidon = this.isSubscribe();
            console.log(bidon);
            this.setState({
                users: bidon
            });
        });
    }

    subscribe(event) {
        event.preventDefault();
        let id = event.target.id;
        axios.put('http://localhost:8080/user/'+this.props.user_id+'/subscribe', {id: id})
        .then( res => {
        });
    }

    isSubscribe() {
        console.log("c'est là : ",this.props.subscriptions_id);
        let users = this.state.users;
        this.state.users.forEach( (user,index) => {
            users[index].subscribe = false;
            this.props.subscriptions_id.forEach(subscription_id => {
                if (subscription_id == user._id) {
                    users[index].subscribe = true;
                }
            });
        });
        return users;
    }

    render() {
        console.log("silissioniste")
        console.log(this.props.subscriptions_id)
        console.log(this.props.id)
        return (
            <div className="UsersList">
                <h3>Users List</h3>
                {this.props.subscriptions_id}
                <ul>
                {
                    this.state.users.map(user => {
                        let path = '/'+user.username;
                        console.log(user.subscribe);
                        return (
                            <li key={user._id}>
                                <Link to={path}>{user.username}</Link>
                                { (user._id !== this.props.user_id) && (!user.subscribe)
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
