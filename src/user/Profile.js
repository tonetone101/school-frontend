import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "./apiUser";
import DefaultProfile from "../images/avatar.jpeg";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";
import { listByUser } from "../post/apiPost";
import { uploadByUser } from "../upload/apiUpload";
import {Container, 
  Body,
  Content,
  Aside
} from 'react-holy-grail-layout'

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: [],
      uploads: []
    };
  }

  // check follow
  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user._id).then(data => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
        this.loadUploads(data._id);
      }
    });
  };

  loadUploads = userId => {
    const token = isAuthenticated().token;
    uploadByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ uploads: data });
      }
    });
  };

  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }
  

  render() {
    const { redirectToSignin, user, posts, uploads } = this.state;
    if (redirectToSignin) return <Redirect to="/signin" />;

    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div>
        <Container>
          <Body>
            <Content style={{'margin': '50px 0 0 10px'}}>
            <h2 className="mt-5 mb-5">Profile</h2>
            <div className="row">
              <div className="col-md-4">
                <img
                  style={{ height: "200px", width: "auto" }}
                  className="img-thumbnail"
                  src={photoUrl}
                  onError={i => (i.target.src = `${DefaultProfile}`)}
                  alt={user.name}
                />

              
              </div>

              <div className="col-md-8">
                <div className="lead mt-2">
                  <p>Hello {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>{`Member since ${new Date(user.created).toDateString()}`}</p>
                </div>

                {isAuthenticated().user &&
                isAuthenticated().user._id === user._id ? (
                  <div className="row">
                    <Link
                      className="btn btn-raised btn-info mr-5"
                      to={`/post/create`}
                    >
                      Create Post
                    </Link>

                   
                    
                                        

                    <Link
                      className="btn btn-raised btn-success mr-5"
                      to={`/user/edit/${user._id}`}
                    >
                      Edit Profile
                    </Link>
                    <DeleteUser userId={user._id} />
                  </div>
                ) : (
                  <div className='row'>
                    {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id ? (
                          null
                        ) : (
                          <div className='mr-5'>
                            <FollowProfileButton
                            following={this.state.following}
                            onButtonClick={this.clickFollowButton}
                          />
                          </div>
                        )}
                    <button  style={{backgroundColor: 'blue', color: 'white'}} className="btn btn-raised mr-5" >Send Message</button>
                    <Link className=''  to={`/uploads/by/${user._id}`}  >
                      <button style={{backgroundColor: 'blue', color: 'white'}} className="btn btn-raised mr-5">
                        Uploads
                      </button>
                    </Link>
                  </div>
                )}

                <div>
                  {isAuthenticated().user &&
                    isAuthenticated().user.role === "admin" && (
                      <div class="card mt-5">
                        <div className="card-body">
                          <h5 className="card-title">Admin</h5>
                          <p className="mb-2 text-danger">
                            Edit/Delete as an Admin
                          </p>
                          <Link
                            className="btn btn-raised btn-success mr-5"
                            to={`/user/edit/${user._id}`}
                          >
                            Edit Profile
                          </Link>
                          {/*<DeleteUser userId={user._id} />*/}
                          <DeleteUser />
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col md-12 mt-5 mb-5">
                <hr />
                <p className="lead">{user.about}</p>
                <hr />

                <ProfileTabs
                  followers={user.followers}
                  following={user.following}
                  posts={posts}
                  uploads={uploads}
                />
              </div>
            </div>
            </Content>

            <Aside bg='grey' left p={2} style={{'width': '1000px', 'border-right': 'solid black', 'padding-top': '25px' }}>
            {isAuthenticated() && (
                                <div>
                                    <div className="aside">
                                        <div >
                                            <Link className=''  to={`/user/${isAuthenticated().user._id}`}  style={{'fontColor': 'white'}}>
                                                {`${isAuthenticated().user.name}'s profile`}
                                            </Link>
                                        </div>

                                       <div>
                                            <Link className=''  to={`/uploads/by/${isAuthenticated().user._id}`}  >
                                                Uploads
                                            </Link>
                                        </div>

                                        <div>
                                            <a id='news' style={{color: 'white'}} onClick={() => {
                                                window.open('https://www.google.com/search?sxsrf=ACYBGNRWDFSZNZnR3i_BNLD6hIfbYu-2tg%3A1572800724186&source=hp&ei=1Ai_Xe3cCKKc5wLgqbWgCw&q=education+news&oq=education+news&gs_l=psy-ab.3..0l10.31182.33928..34348...2.0..0.151.1260.14j1......0....1..gws-wiz.....10..35i362i39j35i39j0i131j0i67j0i10i67.WmTEVjwmRyM&ved=0ahUKEwjtltyjw87lAhUizlkKHeBUDbQQ4dUDCAg&uact=5', '_blank')
                                            }} >News</a>
                                        </div>

                                    </div>
                                </div>
                            )}
                    </Aside>

                        <Aside bg='grey'  right p={2}style={{'border-left': 'solid black', 'padding-top': '25px'}}  >
                        {isAuthenticated() && (
                                <div>
                                    <div className="aside">
                                        <div >
                                            <Link className='mb-5'  to={`/findpeople`}  >
                                                Find People
                                            </Link>
                                        </div>

                                        <div >
                                            <Link className='mb=5'  to={`/post/create`}  >
                                                Create Post
                                            </Link>
                                        </div>

                                       

                                    </div>
                                </div>
                            )}
                        </Aside>
          </Body>
        </Container>
      </div>
    );
  }
}

export default Profile;
