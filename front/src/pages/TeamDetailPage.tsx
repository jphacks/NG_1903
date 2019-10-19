import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import "./arrow.css"

const TeamDetailPage: React.FC<RouteComponentProps>  = props => {
    return (
        <div className="arrow" onClick={() => props.history.push("/")} />
    )
}

export default withRouter(TeamDetailPage)