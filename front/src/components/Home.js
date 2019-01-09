import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import UsersList from './UsersList';
import Message from './Message';
import MessageForm from './MessageForm';

class Home extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        
        this.state = {
            id: "",
            username: "",
            messages: []
        };
    }

    componentWillMount() {
        axios.get('http://localhost:8080/message/')
        .then( res => {
            this.setState({
                messages: res.data
            })
        });
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

    logout = event => {
        event.preventDefault();
        this.props.cookies.remove("token");
        this.setState({
            id: "",
            username: ""
        });
    }

    newMessage = (message) => {
        let messages = this.state.messages;
        messages.push(message)
        this.setState({
            messages: messages
        });
    }

    render() {
        const {username, id} = this.state;
        return (
            <div>
                <h1>Homepage</h1>
                <div className="header">
                { username 
                ? <p>Welcome {username} (<a href="/" onClick={this.logout}>logout</a>)
                <Link to={'/edituser'}>Click here to change your profil !</Link></p>
                : <Link to={'/login'}>Click here to login !</Link>
                }
                </div>
                { (id != "")
                ?
                <div className="messageForm">
                    <MessageForm user_id={id} newMessageChange={this.newMessage}/>
                </div>
                : 
                <div></div>
                }
                <div className="messages">
                    <Message user_id={id} messages={this.state.messages}/>
                </div> 
                <div className="users">
                    <UsersList user_id={id} />
                </div>  
            </div>
            
        );
    }
}

export default withCookies(Home); 