import React, {Component} from 'react'
import {isAuthenticated} from '../auth'
import {read, update, updateUser} from './apiUser'
import {Redirect, Link} from 'react-router-dom'
import DefaultProfile from '../images/avatar.jpeg'
import {Container, 
    Body,
    Content,
    Aside,
  } from 'react-holy-grail-layout'

class EditProfile extends Component {
    constructor() {
        super()
        this.state = {
            id: '',
            name: '',
            email: '',
            password: '',
            error: '',
            role: '',
            redirectToProfile: false,
            fileSize: 0,
            loading: false,
            about: ''
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token).then(data => {
            console.log(data.role)
            if (data.error) {
                this.setState({redirectToProfile: true})
            } else {
                this.setState({id: data._id, name: data.name, email: data.email, role: data.role, error: '', about: data.about})
            }
        })
    }

    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId
        this.init(userId)
    }

    isValid = () => {
        const {name, email, password, fileSize} = this.state
        if (fileSize > 1000000) {
            this.setState({ error: 'File size to big'})
            return false
        }
        //email name
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({error: "A valid Email is required", loading: false})
            return false
        } 
        if(name.length === 0) {
            this.setState({error: "Name is required", loading: false})
            return false
        } 
        if(password.length >= 1 && password.length <= 5) {
            this.setState({error: "Password must be at least 6 characters long", loading: false})
            return false
        } 
        return true
    }

    handleChange = (name) => event => {
        this.setState({error:''})
        const value = name === 'photo' ? event.target.files[0] : event.target.value
        const fileSize = name === 'photo' ? event.target.files[0].size : 0
        this.userData.set(name, value)
        this.setState({
            [name]: value, fileSize
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        this.setState({loading: true})
        if(this.isValid()) {
            // console.log(user)
            const userId = this.props.match.params.userId
            const token = isAuthenticated().token
    
            update(userId, token, this.userData).then(data => {
                if(data.error) {
                    this.setState({error: data.error})
                } else if (isAuthenticated().user.role === 'admin') {
                    this.setState({
                        redirectToProfile: true
                    })
                }
                else updateUser(data, () => {
                    this.setState({
                        redirectToProfile: true
                    })
                })
                
            })
        }
    }

    editForm = (name, email, password, about, role) => {
        return (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Profile Photo</label>
                <input onChange={this.handleChange('photo')} type='file' accept='image/*' className='form-control' />
            </div>

            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input onChange={this.handleChange('name')} type='text' className='form-control' value={name} />
            </div>

            <div className='form-group'>
                <label className='text-muted'>Email</label>
                <input onChange={this.handleChange('email')} type='email' className='form-control' value={email} />
            </div>
            {isAuthenticated() && isAuthenticated().user.role === 'admin' && (
                         <div className='form-group'>
                            <label className='text-muted'>Role</label>
                            <input onChange={this.handleChange('role')} type='text' className='form-control' value={role} />
                        </div>
                           
                           )
                       }

           

            <div className='form-group'>
                <label className='text-muted'>About</label>
                <textarea onChange={this.handleChange('about')} type='text' className='form-control' value={about} />
            </div>
            
            <div className='form-group'>
                <label className='text-muted'>Password</label>
                <input onChange={this.handleChange('password')} type='password' className='form-control' value={password} />
            </div>
            <button onClick={this.handleSubmit} className='btn btn-raised btn-primary'>Update</button>
        </form>
        )
    }

    render() {
        const {id, name, email, password, redirectToProfile, error, loading, about} = this.state

        if(redirectToProfile) {
           return <Redirect to={`/user/${id}`} />
        }
        // photo
        const photoUrl =  id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile
        

        return (
            <div>
                <Container>
                    <Body>
                        <Content style={{'margin': '50px 0 0 10px'}}>
                            <h2 className='mt-5 mb-5'>Edit Profile</h2>

                            <div className='alert alert-danger' style={{display: error ? "" : "none"}}>
                                {error}
                            </div>

                            {loading ? ( 
                            <div className='jumbotron text-center'>
                                <h2>Loading....</h2>
                            </div>
                            ) : (
                                ""
                            )
                            }
                            <img style={{height: '200px', width: 'auto'}} className='img-thumbnail' src={photoUrl} onError={i => (i.target.src = `${DefaultProfile}`)} alt={this.state.name} />

                            {this.editForm(name, email, password, about)}
                        </Content>

                        

                        
                    </Body>
                </Container>
                
            </div>
        )
    }
}

export default EditProfile