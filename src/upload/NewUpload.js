import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiUpload";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import {withTracking} from 'react-tracker'
import {getStudentUploadEvent} from '../tracking/events/upload'
import {Container, Body, Content } from 'react-holy-grail-layout'


class NewUpload extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: '',
            url: '',
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToUpload: false,
           // events: []
        };
        this.onChange = editorState => this.setState({editorState})

    }

    componentDidMount() {
        this.uploadData = new FormData();
        this.setState({ user: isAuthenticated().user});
    }

    isValid = () => {
        const { title, url, body, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: "File size should be less than 100kb",
                loading: false
            });
            return false;
        }
        if (title.length === 0 || url.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.uploadData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.uploadData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    let newUpload = 'New Document by' +' '+ data.uploadedBy.name
                    
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        url:"",
                        redirectToUpload: true,
                        //events
                   });
                    console.log(getStudentUploadEvent)
                    this.props.trackStudentUpload( data.uploadedBy.name, data.title )
                   // window.alert(newUpload)
                }
            });
        }
    };

    newPostForm = (title, url, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted"></label>
                <input
                    onChange={this.handleChange("photo")}
                    type="file"
                    accept=".xlsx,.xls,image/*,.doc, .zip, .docx,.ppt, .pptx,.txt,.pdf, .html, .rtf" 
                    className="form-control"
                />
            </div>        

            <div className="form-group">
                <label className="text-muted">Title of Document</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Description of Document</label>
                <input
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Url of Document</label>
                <input
                    onChange={this.handleChange("url")}
                    type="text"
                    className="form-control"
                    value={url}
                />
            </div>                                 

            <div className='row'>
                <button
                    onClick={this.clickSubmit}
                    className="btn btn-raised btn-primary"
                    style={{'marginLeft': '10px'}}
                >
                    Upload File
                </button>
                <Link className='btn btn-raised ml-5' to={'/uploads'}>Back</Link>

               
            </div>
        </form>
    );

    render() {
        const {
            title,
            body,
            url,
            error,
            loading,
            redirectToUpload,
            //events
        } = this.state;
       

        if (redirectToUpload) {
            return <Redirect to={`/uploads/by/${isAuthenticated().user._id}`} />;
            
        }

        return (
            <div>
                <Container>
                    <Body>
                        <Content style={{'margin': '50px 0 0 10px'}}>
                        <div
                            className="alert alert-danger"
                            style={{ display: error ? "" : "none" }}
                        >
                            {error}
                        </div>

                        {loading ? (
                            <div className="jumbotron text-center">
                                <h2>Loading...</h2>
                            </div>
                        ) : (
                            ""
                        )} 
        

                        {this.newPostForm(title, url, body)}
                        </Content>

                        

                    </Body>
                </Container>
            </div>
        );
    }
}

const mapTrackingToProps = trackevent => {
    return {
      trackStudentUpload: (NewUploadBy, uploadName) => 
        trackevent(getStudentUploadEvent(NewUploadBy, uploadName)) 
      }
  }

export default withTracking(mapTrackingToProps)(NewUpload);