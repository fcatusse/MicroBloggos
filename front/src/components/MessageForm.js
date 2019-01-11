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
            };
        } else {
            this.state = {
                content: this.props.content,
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

    createMessage() {
        let body = {
            user_id: this.props.user_id,
            content: this.state.content
        }
        axios.post('http://localhost:8080/message/create', body)
        .then(res => {
            this.newMessage(res.data.message);
            this.setState({
                content: ""
            });
        });
    }
    
    handleSubmit = event => {
        event.preventDefault();
        if (this.props.user_id) {
            this.createMessage();
        }
        if (this.props.id) {
            let body = {
                content: this.state.content
            }
            axios.put('http://localhost:8080/message/' + this.props.id + '/update', body)
            .then(res => {
                let data = res.data.result;
                data.content = body.content;
                this.updateMessage(data);
                this.props.content = undefined;
                this.setState({
                    content: ""
                });
            });
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
