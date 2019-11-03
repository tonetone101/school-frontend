import React, {Component} from 'react'
import {singleUpload, remove, like, unlike} from './apiUpload'
import {Link, Redirect} from 'react-router-dom'
import {isAuthenticated} from '../auth'
import DefaultPost from "../images/person.png";
import FileComment from './FileComment'
// import { Document, Page, pdfjs } from 'react-pdf'
import {Container, 
    Body,
    Content,
    Aside,
  } from 'react-holy-grail-layout'


class SingleUpload extends Component {
    state = {
        upload: '',
        redirectToUpload: false,
        redirectToSignIn: false,
        like: false,
        likes: 0,
        comments: []
    }
    
    checkLike = (likes) => {
        const userId = isAuthenticated() && isAuthenticated().user._id
        let match = likes.indexOf(userId) !== -1
        return match;
    }

    componentDidMount = () => {
        const uploadId = this.props.match.params.uploadId
        singleUpload(uploadId).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    upload: data, 
                    likes: data.likes.length, 
                    like: this.checkLike(data.likes),
                    comments: data.comments
                })
            }
        }) 
    }

    updateComments = comments => {
        this.setState({comments})
    }

    likeToggle = () => {
        if(!isAuthenticated()) {
            this.setState({
                redirectToSignIn: true
            })
            return false
        }
        let callApi = this.state.like ? unlike : like
        const userId = isAuthenticated().user._id
        const uploadId = this.state.upload._id
        const token = isAuthenticated().token
        
        callApi(userId, token, uploadId).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                })
            }
        })
    }

    deleteUpload = () => {
        const uploadId = this.props.match.params.uploadId
        const token = isAuthenticated().token
        remove(uploadId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({redirectToUpload: true})
            }
        })
    }

    deleteConfirm = () => {
        let answer = window.confirm('Are you sure you want to delete your upload?')
        if(answer) {
            this.deleteUpload()
        }
    }

    onError = e => {
        console.logError(e, 'error in file viewer')
    }
    

    renderUpload = (upload) => {
        const uploaderId = upload.uploadedBy
        ? `/user/${upload.uploadedBy._id}`
        : "";
    const uploaderName = upload.uploadedBy
        ? upload.uploadedBy.name
        : " Unknown";

        const photoUrl = upload.uploadedBy
        ? `${process.env.REACT_APP_API_URL}/user/photo/${
            upload.uploadedBy._id
          }?${new Date().getTime()}`
        : DefaultPost;

        const fileUrl = `${
            process.env.REACT_APP_API_URL
        }/upload/photo/${upload._id}`

        const {likes, like} = this.state

        

        return (
                <div className="column" >
                    
                   
                    <p className="font-italic mark">
                        Uploaded by{" "}
                        <Link to={`${uploaderId}`}>
                        <img  style={{ height: "40px", borderRadius:'30px', width: "40px" }} className="img-thumbnail" src={photoUrl} alt='' />

                            {uploaderName}{" "}
                        </Link>
                        {new Date(upload.created).toDateString()}
                    </p>
                    <br />
                    
                    
                    <p className="card-text">
                        {upload.body}
                    </p>
                    <img
                        src={`${
                            process.env.REACT_APP_API_URL
                        }/upload/photo/${upload._id}`}
                        alt=''
                        onError={i =>
                            (i.target.src = ``)
                        }
                        className="img-thunbnail mb-3 ml-50"
                        style={{height: 'auto', width: '100%', objectFit: 'cover'}}
                    />
                    
                    <div className='container'> 
                        <iframe src={fileUrl} title='file' style={{height: '100vh', width: '100%'}}></iframe>
                    </div>
                   
                    {like ? (
                        <h3 onClick={this.likeToggle}>
                           <i className='fa fa-thumbs-up text-primary bg-dark' style={{padding: '10px', borderRadius: '50%'}}/>{' '}
                        {likes} likes
                    </h3>
                    ) : (
                        <h3 onClick={this.likeToggle}>
                            <i className='fa fa-thumbs-up text-warning bg-dark' style={{padding: '10px', borderRadius: '50%'}}/>{' '}
                        {likes} unlike
                    </h3>
                    )}
                    
                    {/* <div>
                    <Document file={{url: fileUrl}} onDocumentLoadSuccess={this.onDocumentLoadSuccess}> 
                        <Page size='A4' pageNumber={this.state.pageNumber} />
                    </Document>
                    <p>Page {this.state.pageNumber} of {this.state.numPages}</p> 
                    
                    <object data={fileUrl} type='application/pdf'>
                        <iframe src={fileUrl}></iframe>
                    </object>
                    
                    <FileViewer
                        fileType={type}
                        filePath={fileUrl}
                    />

                    </div> */}
                    <div className='d-inline-block'>
                        <Link
                            to={`/uploads/by/${
                                upload.uploadedBy._id
                              }`}
                            className="btn btn-raised btn-primary btn-sm"
                        >
                            Back to uploads
                        </Link>
                       {isAuthenticated().user && 
                        isAuthenticated().user._id === upload.uploadedBy._id &&  
                        <>
                             <Link to={`/upload/edit/${upload._id}`} className='btn btn-raised btn-warning ml-4 btn-sm mr-4'>
                                Update Upload
                            </Link>
                            <button onClick={this.deleteConfirm} className='btn btn-raised btn-warning btn-sm'>
                                Delete Upload
                            </button>
                        </>
                        
                        }
                    </div>
                </div>
        );
    }

    render(){
        const {upload, comments, redirectToSignIn, redirectToUpload, } = this.state
        console.log(comments)
        if(redirectToUpload ) {
            return <Redirect to={`/uploads/by/${isAuthenticated().user._id}`} />
         } else if (redirectToSignIn) {
             return <Redirect to={`/signin`} />
         }
         
        return (
            <div>
                <Container>
                    <Body>
                        <Content style={{'margin': '100px 0 0 10px'}} >
                            <div className='text-center'>
                                {!upload ? ( 
                                    <div className='jumbotron text-center'>
                                        <h2>Loading....</h2>
                                    </div>
                                    ) : (
                                        this.renderUpload(upload)
                                    )
                                }
                                <div className='container'>
                                    <FileComment uploadId={upload._id} comments={comments.reverse()} updateComments={this.updateComments}/>
                                </div>
                            </div>
                        </Content>

                        <Aside bg='grey' left p={2} style={{'width': '1000px', 'border-right': 'solid black' }}>
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

                        <Aside bg='grey'  right p={2}style={{'border-left': 'solid black' }}  >
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
        )
    }
}

export default SingleUpload