import React from 'react';
import axios from 'axios';
//import { Link } from 'react-router-dom';
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import MessageForm from "./MessageForm";

class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: "",
            messages_users: [],
            edit_message: null
        };
        this.deleteMessage = this.deleteMessage.bind(this); // Car dans le Render (fct evenement)
        this.editMessage = this.editMessage.bind(this);
        this.editMessageChange = this.editMessageChange.bind(this);
    }

    componentWillReceiveProps() {
        this.setState({
            messages_users: this.props.messages_users
        });
    }

    spliceMessage(id) {
        this.props.spliceMessage(id);
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
        event.preventDefault();
        var id = event.target.id;
        this.setState({
            edit_message: id
        });
    }
    
    editMessageChange(message) {
        this.setState({
            edit_message: null
        })
        this.props.editMessageChange(message);
    }

    render() {
        return (
            <div className="Message">
                <h3>Messages list</h3>
                <ul>
                {
                    this.props.messages_users.map(message_user => {
                        return (
                            <li key={message_user.id}>
                                <br /><i>(post by {message_user.username} at {message_user.create_time})</i><br />
                                { (this.state.edit_message === message_user.id)
                                ? <MessageForm 
                                    key={message_user.id}
                                    id={message_user.id} 
                                    content={message_user.content} 
                                    editMessageChange={this.editMessageChange} 
                                />
                                : <span>{message_user.content} <br /></span>
                                }
                                { (message_user.user_id === this.props.user_id) && (this.state.edit_message !== message_user.id) 
                                ? <span><button id={message_user.id} onClick={this.editMessage}>Modifiy</button> <button id={message_user.id} onClick={this.deleteMessage}>Delete</button></span>
                                : <span></span>
                                }
                                <br />
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
