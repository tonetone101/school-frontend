import React, { Component } from "react";
import { follow, unfollow } from "./apiUser";

class FollowProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <div className="d-flex">
                {!this.props.following ? (
                    <button
                        onClick={this.followClick}
                        style={{backgroundColor: 'blue', color: 'white'}}
                        className="btn btn-raised mr-5"
                    >
                        Follow
                    </button>
                ) : (
                    <button
                        onClick={this.unfollowClick}
                        className="btn btn-warning btn-raised"
                    >
                        UnFollow
                    </button>
                )}
            </div>
        );
    }
}

export default FollowProfileButton;
