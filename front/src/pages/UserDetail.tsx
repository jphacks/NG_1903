import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import "./arrow.css";

const UserDetail: React.FC<RouteComponentProps>  = props => {
    return (
        <div>
            <div className="arrow" onClick={() => props.history.push("/")} />
        </div>
    )
}

export default withRouter(UserDetail)