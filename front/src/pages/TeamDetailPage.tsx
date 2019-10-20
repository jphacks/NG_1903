import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import "./arrow.css"
import TeamDetail from '../component/TeamDetailComponent'

const TeamDetailPage: React.FC<RouteComponentProps>  = props => {
    console.log(props.location.state.teamDetail)

    return (
        <section style={{
            backgroundColor: '#E5E5E5',
            height: '100vh',
        }}>
            <div className="arrow" onClick={() => props.history.push("/")} />
            <TeamDetail teamData={props.location.state.teamDetail}/>
        </section>
    )
}

export default withRouter(TeamDetailPage)