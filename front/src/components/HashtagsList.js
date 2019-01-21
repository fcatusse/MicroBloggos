import React from 'react';
import { Link } from 'react-router-dom';
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class HashtagsList extends React.Component {

    render() {
        return (
            <div className="HashtagsList">
                <h3>Hashtags List</h3>
                <ul>
                {
                    this.props.hashtags.map(hashtag => {
                        let path = '/hashtag/'+hashtag.name; 
                        return (
                            <li key={hashtag._id}>
                                <Link to={path}>#{hashtag.name}</Link>
                            </li>                     
                        )
                    })
                }
                </ul>
            </div>
        );
    }
}

export default HashtagsList;
