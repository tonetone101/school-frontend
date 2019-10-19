import React from 'react'
// withRouter to give us access to props
import {Link, withRouter} from 'react-router-dom'
import {signout, isAuthenticated} from '../auth'

const isActive = (history, path) => {
    if(history.location.pathname === path) return {color: '#ff9900'}
        else return {color: "#ffffff"}
}


const Menu = ({history}) => {
    return (
        <nav className="navbar navbar-expand">
            <div className="container-fluid">
                <ul className="nav navbar-nav navbar-right">
                    <li className="nav-item">
                        <Link className='nav-link' style={isActive(history, '/')} to='/'>Home</Link>
                    </li>

                    <li className="nav-item">
                        <Link className='nav-link' style={isActive(history, '/users')} to='/users'>Users</Link>
                    </li>
                </ul>
                    
                {!isAuthenticated() && (
                    <ul className="nav navbar-nav navbar-right">
                            <li >
                                <Link className='nav-link' style={isActive(history, '/signup')} to='/signup'>Sign Up</Link>
                            </li>
                        
                            <li >
                                <Link className='nav-link' style={isActive(history, '/signin')} to='/signin'>Sign In</Link>
                            </li>
                        </ul>
                )}

                    {isAuthenticated() && (
                        <ul className="nav navbar-nav navbar-right">
                            <li >
                                <Link className='nav-link'  to={`/user/${isAuthenticated().user._id}`} style={isActive(history, `/user/${isAuthenticated().user._id}`)} >
                                    {`${isAuthenticated().user.name}'s profile`}
                                </Link>
                            </li>

                            <li >
                                <Link className='nav-link'  to={`/findpeople`} style={isActive(history, `/findpeople`)} >
                                    Find People
                                </Link>
                            </li>

                            <li >
                                <Link className='nav-link'  to={`/post/create`} style={isActive(history, `/post/create`)} >
                                    Create Post
                                </Link>
                            </li>

                            <li>
                                <Link className='nav-link'  to={`/uploads`} style={isActive(history, `/upload/create`)} >
                                    Upload
                                </Link>
                            </li>

                            <li >
                                <span className='nav-link' style={{cursor: 'pointer', color: '#fff'}} onClick={() => signout(() => history.push('/'))}>Sign Out</span>
                            </li>
                        </ul>
                    )}
            </div>
        </nav>
    )
}

export default withRouter(Menu)

