import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class Message extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: "",
            users: []
        };
    }

    componentWillMount() {
        axios.get('http://localhost:8080/user/')
        .then( res => {
            this.setState({
                users: res.data
            })
        });
    }

    render() {
        return (
            <div className="Message">
                <h3>Messages list</h3>
                <ul>
                {
                    this.props.messages.map(message => {
                        return (
                            <li key={message._id}>
                                {message.content}
                                { message.user_id == this.props.user_id
                                ? <span><button>Modifiy</button> <button>Delete</button></span>
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
