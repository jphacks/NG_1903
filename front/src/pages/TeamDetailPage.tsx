import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import "./arrow.css"

const TeamDetailPage: React.FC<RouteComponentProps>  = props => {
    console.log(props.location.state.TeamDetail)
    return (
        <div className="arrow" onClick={() => props.history.push("/")} />
    )
}

export default withRouter(TeamDetailPage)