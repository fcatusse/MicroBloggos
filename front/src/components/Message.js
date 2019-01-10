import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import MessageForm from "./MessageForm";

class Message extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "",
            users: [],
            messages_users: [],
            edit_message: null
        };
        this.deleteMessage = this.deleteMessage.bind(this); // Car dans le Render (fct evenement)
        this.editMessage = this.editMessage.bind(this);
        this.editMessageChange = this.editMessageChange.bind(this);
    }

    mergeMessagesUsers() {
        let messages_users = [];
        this.props.messages.map(message => {
            this.props.users.map(user => {
                if (message.user_id == user._id) 
                {
                    messages_users.push({
                        id: message._id,
                        content: message.content,
                        username: user.username,
                        create_time: message.create_time,
                        user_id: user._id
                    });
                }
            });
        });
        this.setState({
            messages_users: messages_users
        });
    }

    componentWillReceiveProps() {
        this.mergeMessagesUsers();
    }

    spliceMessage(id) {
        let i = 0
            let test = this.state.messages_users;
            test.map(message_user => {
                if (message_user.id == id) {
                    test.splice(i, 1);
                }
                i++;
            });
            this.setState({
                messages_users: test
            })
    }

    deleteMessage(event) {
        event.preventDefault();
        var id = [event.target.id];
        axios.delete('http://localhost:8080/message/' + id + '/delete')
        .then( (res) => {
            this.spliceMessage(res.data.result._id);
        });
    }

    editMessage(event) {
        var id = [event.target.id];
        console.log(id);
                event.preventDefault();
                var id = [event.target.id];
                console.log(id);
                this.setState({
                    edit_message: id
                });
    }

    
    editMessageChange(event) {
        event.preventDefault();
        this.setState({
            edit_message: null
        })
    }


    render() {
        return (
            <div className="Message">
                <h3>Messages list</h3>
                <ul>
                {
                    this.state.messages_users.map(message_user => {
                        return (
                            <li key={message_user.id}>
                                {message_user.content} <br /><i>(post by {message_user.username} at {message_user.create_time})</i>
                                { message_user.user_id == this.props.user_id
                                ? <span><button id={message_user.id} onClick={this.editMessage}>Modifiy</button> <button id={message_user.id} onClick={this.deleteMessage}>Delete</button></span>
                                : <span></span>
                                }
                                { (this.state.edit_message == message_user.id)
                                ? <MessageForm id={message_user.id} editMessageChange={this.editMessage} />
                                : <span></span>
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

export default Message;
