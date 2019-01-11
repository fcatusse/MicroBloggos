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
            messages: [],
            messages_users: [],
            users: []
        };
        this.spliceMessage = this.spliceMessage.bind(this);
        this.editMessageChange = this.editMessageChange.bind(this);
    }

    generateMessagesUsers() {
        axios.get('http://localhost:8080/message/')
        .then( res => {
            this.setState({
                messages: res.data
            })
            axios.get('http://localhost:8080/user/')
            .then( res => {
                this.setState({
                    users: res.data
                })
                this.mergeMessagesUsers();
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
            });
        });
    }

    mergeMessagesUsers() {
        let messages_users = [];
        this.state.messages.forEach(message => {
            this.state.users.forEach(user => {
                if (message.user_id === user._id) 
                {
                    let date = message.create_time;
                    date = date.substring(8, 10)+'/'+date.substring(5, 7)+'/'+date.substring(0, 4)+
                    ' - '+date.substring(11, 16);
                    messages_users.push({
                        id: message._id,
                        content: message.content,
                        username: user.username,
                        create_time: date,
                        user_id: user._id
                    });
                }
            });
        });
        this.setState({
            messages_users: messages_users
        });
    }

    componentWillMount() {
        this.generateMessagesUsers();
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
        messages.splice(0, 0, message);
        this.setState({
            messages: messages
        });
        this.mergeMessagesUsers();
    }

    editMessageChange(editMessage) {
        let i = 0;
        let messages = this.state.messages;
        messages.forEach(message => {
            if(message._id === editMessage._id) {
                messages[i].content = editMessage.content;
            }
            i++;
        });
        this.mergeMessagesUsers();
    }

    spliceMessage(id) {
        let i = 0;
        this.state.messages_users.forEach(message_user => {
            if (message_user.id === id) {
                this.state.messages_users.splice(i, 1);
                this.state.messages.splice(i, 1);
            }
        i++;
        });
        this.setState({
            messages_users: this.state.messages_users,
            messages: this.state.messages
        })
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
                { (id !== "")
                ?
                <div className="messageForm">
                    <MessageForm 
                        user_id={id} 
                        newMessageChange={this.newMessage}
                    />
                </div>
                : 
                <div></div>
                }
                <div className="messages">
                    <Message 
                        user_id={id} 
                        messages_users={this.state.messages_users} 
                        editMessageChange={this.editMessageChange}
                        spliceMessage={this.spliceMessage} 
                    />
                </div> 
                <div className="users">
                    <UsersList user_id={id} />
                </div>  
            </div>
            
        );
    }
}

export default withCookies(Home); 