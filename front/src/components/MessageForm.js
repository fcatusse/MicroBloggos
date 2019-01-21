import React from 'react';
import axios from 'axios';
//import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class MessageForm extends React.Component {
    
    constructor(props) {
        super(props);
        if (this.props.content === undefined) {
            this.state = {
                content: "",
                old_content: ""
            };
        } else {
            this.state = {
                content: this.props.content,
                old_content: this.props.content
            };
        }
        this.updateMessage = this.updateMessage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    newMessage = (message) => {
        this.props.newMessageChange(message);            
    }

    updateMessage = (message) => {
        this.props.editMessageChange(message);            
    }

    handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }

    checkHashtags(content, old_content = "") {
        let regex = /(#[a-zA-Z0-9_-]+)/g;
        let hashtags = content.match(regex);
        if (hashtags === null) {
            hashtags = [];
        }
        let old_hashtags = old_content.match(regex);
        if (old_hashtags === null) {
            old_hashtags = [];
        }
        let result = [];
        hashtags.forEach(newHashtag => {
            newHashtag = newHashtag.substring(1);
            let addTag = true;
            old_hashtags.forEach(oldHashtag => {
                oldHashtag = oldHashtag.substring(1);
                if (newHashtag === oldHashtag) {
                    addTag = false;
                }
            }); 
            if (addTag) {
                let id = null;
                this.props.hashtags.forEach(hashtag => {
                    if (newHashtag === hashtag.name) {
                        id = String(hashtag._id);
                    }
                });
                result.splice(0, 0, {
                    name: newHashtag,
                    _id: id,
                    action: 'add'
                });
            }            
        });
        old_hashtags.forEach(oldHashtag => {
            oldHashtag = oldHashtag.substring(1);
            let deleteTag = true;
            hashtags.forEach(newHashtag => {
                newHashtag = newHashtag.substring(1);
                if (newHashtag === oldHashtag) {
                    deleteTag = false;
                }
            });  
            if (deleteTag) {
                let id = null;
                this.props.hashtags.forEach(hashtag => {
                    if (oldHashtag === hashtag.name) {
                        id = String(hashtag._id);
                    }
                });
                result.splice(0, 0, {
                    name: oldHashtag,
                    _id: id,
                    action: 'delete'
                });
            }
        });
        return result;
    }

    createMessage() {
        let hashtags = this.checkHashtags(this.state.content);
        let body = {
            user_id: this.props.user_id,
            content: this.state.content,
            hashtags: hashtags
        }
        axios.post('http://localhost:8080/message/create', body)
        .then(res => {
            this.newMessage(res.data.message);
            this.setState({
                content: ""
            });
        });
    }
    
    editMessage() {
        let hashtags = this.checkHashtags(this.state.content, this.state.old_content);
        let body = {
            content: this.state.content,
            hashtags: hashtags
        }
        axios.put('http://localhost:8080/message/' + this.props.id + '/update', body)
        .then(res => {
            let data = res.data.result;
            data.content = body.content;
            this.updateMessage(data);
            this.setState({
                content: "",
                old_content: ""
            });
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.props.user_id) {
            this.createMessage();
        }
        if (this.props.id) {
            this.editMessage();
        }
    }

    validateForm() {
        if (this.state.content !== undefined) {
            return this.state.content.length > 0 
                && this.state.content.length <= 140 
        }
        return false;
    }

    render() {
        return (
            <div className="MessageForm">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="content" bsSize="large">
                    <ControlLabel>Type your message</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={this.state.content}
                        onChange={this.handleChange}
                        maxLength="140"
                    />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                    Send message
                    </Button>
                </form>
            </div>
        );
    }
}

export default MessageForm;
