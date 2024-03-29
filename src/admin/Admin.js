import React, {Component} from 'react'
import Posts from '../post/Post'
import Users from '../user/Users'
import { isAuthenticated } from '../auth';
import { Redirect} from "react-router-dom";

class Admin extends Component {
    state = {
        redirectToHome: false
    }

    componentDidMount() {
        if(isAuthenticated().user.role !== 'admin') {
            this.setState({redirectToHome: true})
        }
    }

    render() {
        if(this.state.redirectToHome) {
            return <Redirect to='/' />
        }

        return (
            <div className=''>
                <div className='jumbotron text-center'>
                    <h2>Admin Dashboard</h2>
                    
                </div>

                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <h2>Posts</h2>
                            <hr />
                            <Posts/>
                        </div>

                        <div className='col-md-6'>
                            <h2>Users</h2>
                            <hr/>
                            <Users/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Admin