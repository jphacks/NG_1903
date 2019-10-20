import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import "./arrow.css";

const UserDetail: React.FC<RouteComponentProps>  = props => {
    console.log(props.location.state.userData)
    return (
        <div style={{
            backgroundColor: '#E5E5E5',
            height: '100vh',
          }}>
            <div className="arrow" onClick={() => props.history.push("/")} />
        </div>
    )
}

export default withRouter(UserDetail)