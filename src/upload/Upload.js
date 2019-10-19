import React, { Component } from "react";
import { listByUser, read } from "./apiUpload";
import DefaultPost from "../images/person.png";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";


class Upload extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            uploads: []
        };
       
    }

    loadUploads = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token).then(data => {
          if (data.error) {
            console.log(data.error);
          } else {
            this.setState({ uploads: data });
          }
        });
      };

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
          if (data.error) {
            this.setState({ redirectToSignin: true });
          } else {
            this.setState({ user: data});
            this.loadUploads(data._id);
          }
        });
      };

    componentDidMount() {
        const userId = isAuthenticated().user._id;
        this.init(userId);
    }



    render() {
        const { user, uploads } = this.state;
        console.log(user)
        return (
            <div className="col-md-4">
            <h3 className="text-primary">{uploads.length} Uploads</h3>
            <hr />
            {uploads.map((upload, i) => (
                <div key={i}>
                    <div>
                        <Link to={`/upload/${upload._id}`}>
                            <div>
                                <p className="lead">{upload.title}</p>
                            </div>
                        </Link>
                    </div>
                </div>
            ))}
        </div> 
        );
    }
}

export default Upload;


