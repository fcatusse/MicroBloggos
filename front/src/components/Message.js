import React from 'react';
import ReactHtmlParser from 'react-html-parser';
//import { Link } from 'react-router-dom';
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import MessageForm from "./MessageForm";

class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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

    newMessageChange = (message) => {
        this.props.newMessageChange(message);            
    }

    spliceMessage(id) {
        this.props.spliceMessage(id);
    }

    deleteMessage(event) {
        event.preventDefault();
        var id = event.target.id;
        this.spliceMessage(id);
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

    authorizeMessage(message_user) {
        //Homepage
        if ((this.props.profil_username === undefined) && (this.props.hashtag === undefined)) {
            if ((message_user.subscribe) || (this.props.user_id === "")) {
                return this.renderMessage(message_user);
            } 
        }
        //ProfilPage
        if (this.props.profil_username === message_user.username) {
            return this.renderMessage(message_user);
        }
        //HashtagPage
        let hashtag_name = this.props.hashtag;
        let name = this.props.hashtags.find(function(hashtag) {
            return (hashtag.name===hashtag_name)?hashtag:undefined;
        });
        if (name !== undefined) {
            let found = name.messages_id.find(function(message_id) {
                return (message_id===message_user.id)?message_id:undefined;
            }); 
            if (found !== undefined) {
                return this.renderMessage(message_user);
            }
        }
        return <span key={message_user.id}></span>;
    }

    renderMessage(message_user) {
        //console.log(this.props.hashtags);
        return (
            <li key={message_user.id}>
                <br /><i>(post by {message_user.username} at {message_user.create_time})</i><br />
                { (this.state.edit_message === message_user.id)
                ? <MessageForm 
                    key={message_user.id}
                    id={message_user.id} 
                    content={message_user.content} 
                    editMessageChange={this.editMessageChange}
                    newMessageChange={this.newMessageChange}
                    hashtags={this.props.hashtags} 
                />
                : <span>{ ReactHtmlParser(message_user.content_with_link)} <br /></span>
                }
                { (message_user.user_id === this.props.user_id) && (this.state.edit_message !== message_user.id) 
                ? <span><button id={message_user.id} onClick={this.editMessage}>Modifiy</button> <button id={message_user.id} onClick={this.deleteMessage}>Delete</button></span>
                : <span></span>
                }
                <br />
            </li> 
        )
    }

    render() {
        //console.log(this.props.hashtags);
        return (
            <div className="Message">
                <h3>Messages list</h3>
                <ul>           
                {
                this.props.messages_users.map(message_user => {
                    return(this.authorizeMessage(message_user))
                })
                }
                </ul>
            </div>
        );
    }
}

export default Message;
