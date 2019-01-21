import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import UsersList from './UsersList';
import HashtagsList from './HashtagsList';
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
            subscriptions_id: [],
            messages: [],
            messages_users: [],
            users: [],
            hashtags: []
        };
        this.deleteMessage = this.deleteMessage.bind(this);
        this.editMessageChange = this.editMessageChange.bind(this);
        this.deleteSubscribe = this.deleteSubscribe.bind(this);
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
                axios.get('http://localhost:8080/hashtag/')
                .then( res => {
                    this.setState({
                        hashtags: res.data
                    })
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
                                    username: res.data.username,
                                    subscriptions_id: res.data.subscriptions_id
                                })
                            });
                        }
                        this.mergeUsersSubscribes();
                        this.mergeMessagesUsers();
                    });
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
                    let date = this.displayDate(message.create_time);
                    let content_with_link = this.addLinkToHashtag(message.content);
                    messages_users.push({
                        id: message._id,
                        content: message.content,
                        content_with_link: content_with_link,
                        username: user.username,
                        create_time: date,
                        user_id: user._id,
                        subscribe: user.subscribe
                    });
                }
            });
        });
        this.setState({
            messages_users: messages_users
        });
    }

    mergeUsersSubscribes() {
        let users_subscribe = this.state.users;
        this.state.users.forEach((user, index) => {
            users_subscribe[index].subscribe = false;
            this.state.subscriptions_id.forEach((subscription_id) => {
                if (subscription_id === user._id) 
                {
                    users_subscribe[index].subscribe = true;            
                }
            });
            if (this.state.id === user._id) 
            {
                users_subscribe[index].subscribe = true;            
            }
        });
        this.setState({
            users: users_subscribe
        });
    }

    displayDate(date) {
        return date.substring(8, 10)+'/'+date.substring(5, 7)+'/'+date.substring(0, 4)+
        ' - '+date.substring(11, 16);
    }

    addLinkToHashtag(content) {
        let regex = /(#[a-zA-Z0-9_-]+)/g;
        let hashtags = content.match(regex);
        if (hashtags !== null) {
            hashtags.forEach(hashtag => {
                let link = '<a href="/hashtag/'+hashtag.substring(1)+'">'+hashtag+'</a>';
                regex = new RegExp(hashtag, 'g');
                content = content.replace(regex, link);
            })
        }
        return content;
    }

    componentDidMount() {
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

    checkHashtags(id) {
        let regex = /(#[a-zA-Z0-9_-]+)/g;
        let content = "";
        this.state.messages_users.forEach(message_user => {
            if (id === message_user.id) {
                content = message_user.content;
            }
        });
        let hashtags = content.match(regex);
        if (hashtags === null) {
            hashtags = [];
        }
        let result = [];
        hashtags.forEach(deleteHashtag => {
            deleteHashtag = deleteHashtag.substring(1);
            this.state.hashtags.forEach(hashtag => {
                let id = null;
                if (deleteHashtag === hashtag.name) {
                    id = String(hashtag._id);
                    result.splice(0, 0, {
                        name: deleteHashtag,
                        _id: id,
                        action: 'delete'
                    }); 
                }
            }); 
        });
        return result;
    }

    newMessage = (message) => {
        axios.get('http://localhost:8080/hashtag/')
                .then( res => {       
            let messages = this.state.messages;
            messages.splice(0, 0, message);
            this.setState({
                hashtags: res.data,
                messages: messages
            });
            this.mergeMessagesUsers();
        });
    }

    editMessageChange(editMessage) {
        axios.get('http://localhost:8080/hashtag/')
        .then( res => { 
        let i = 0;
        let messages = this.state.messages;
        messages.forEach(message => {
            if(message._id === editMessage._id) {
                messages[i].content = editMessage.content;
            }
            i++;
        });
        this.setState({
            hashtags: res.data,
            messages: messages
        });
        this.mergeMessagesUsers();
        });
    }

    deleteMessage(id) {
        let hashtags = this.checkHashtags(id);
        let content = "";
        this.state.messages_users.forEach(message_user => { 
            if (message_user.id === id) {
                content = message_user.content;
            }
        });
        let body = {
            content: content,
            hashtags: hashtags
        }
        axios.put('http://localhost:8080/message/' + id + '/update', body)
        .then(res => {
            axios.get('http://localhost:8080/hashtag/')
            .then( res => {
                this.setState({
                    hashtags: res.data
                })
            });
        });
        axios.delete('http://localhost:8080/message/' + id + '/delete')
        .then( (res) => {
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
            });
        });
    }

    updateSubscribe(updateUser) {
        this.setState({
            subscriptions_id: updateUser.subscriptions_id
        });
        this.mergeUsersSubscribes();
        this.mergeMessagesUsers();
    }

    newSubscribe = (user) => {
        this.updateSubscribe(user);
    }

    deleteSubscribe(user) {
        this.updateSubscribe(user);
    }

    render() {
        const {username, id, messages_users, users, hashtags} = this.state;
        return (
            <div>
                <h1><Link to={'/'}>HomePage</Link></h1>
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
                        hashtags={hashtags}
                    />
                </div>
                : 
                <div></div>
                }
                <div className="messages">
                    <Message 
                        user_id={id} 
                        profil_username={this.props.profil_username}
                        hashtags={hashtags}
                        hashtag={this.props.hashtag}
                        messages_users={messages_users} 
                        newMessageChange={this.newMessage}
                        editMessageChange={this.editMessageChange}
                        spliceMessage={this.deleteMessage} 
                    />
                </div> 
                <div className="users">
                    <UsersList 
                        user_id={id} 
                        users={users}
                        newSubscribe={this.newSubscribe}
                        deleteSubscribe={this.deleteSubscribe} 
                    />
                </div>
                <div className="hashtags">
                    <HashtagsList users
                        hashtags={hashtags}
                    />
                </div>  
            </div> 
        );
    }
}

export default withCookies(Home); 