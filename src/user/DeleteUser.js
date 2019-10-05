import React, {Component} from 'react'
import {isAuthenticated} from '../auth'


class DeleteUser extends Component {
    deleteAccount = () => {
        const token = isAuthenticated().token
        const userId = this.props.userId
        remove(userId, token)
            .then(data => {
                if(data.error) {
                    console.log(data.error)
                } else {
                    // signout user
                    // redirect
                }
            })
    }

    deleteConfirm = () => {
        let answer = window.confirm('Are you sure you want to delete your account?')
        if(answer) {
            this.deleteAccount()
        }
    }

    render() {
        return (
            <button onClick={this.deleteConfirm} className='btn btn-raised btn-danger'>
                Delete Profile
            </button>
        )
    }
}

export default DeleteUser