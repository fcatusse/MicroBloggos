import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class MessageForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "",
        };
    }

    newMessage = (message) => {
        this.props.newMessageChange(message);            
    }

    handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
    
      handleSubmit = event => {
        event.preventDefault();
    
        let body = {
          user_id: this.props.user_id,
          content: this.state.content
        }
        axios.post('http://localhost:8080/message/create', body)
        .then(res => {
            this.newMessage(body);
            this.setState({
                content: ""
            });
        });
      }

    validateForm() {
        return this.state.content.length > 0 
        && this.state.content.length <= 140 
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
