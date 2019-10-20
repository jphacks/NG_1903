import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Card } from 'react-bootstrap'

import "./ranking.css"
import "./arrow.css"
const topRanking = [
    {rank: 1, userName: "Tapi", rate: 999},
    {rank: 2, userName: "Oka", rate: 700},
    {rank: 3, userName: "JP", rate: 555}
]
const Ranking :React.FC<RouteComponentProps> = props => {
    return (
        <div style={{
            backgroundColor: '#E5E5E5',
            height: '100vh',
        }}>
            <section style={{}}>
                <div className="arrow" onClick={() => props.history.push("/")} />
                <p>〜10/28</p>
            </section>
            <p className="mb-2 text-muted">トップランキング</p>
            <div className="topRanking">
            {topRanking.map(d => {
                return(
                    <div className="rankingNode">
                        <span>{d.rank}</span> <span>{d.userName}</span> <span>{d.rate}</span>
                    </div>
                )
            })}
            </div>

            <p className="mb-2 text-muted">マイランキング</p>
            <div className="myRanking">
            {topRanking.map(d => {
                return(
                    <div className="rankingNode">
                        <span>{d.rank}</span> <span>{d.userName}</span> <span>{d.rate}</span>
                    </div>
                )
            })}
            {topRanking.map(d => {
                return(
                    <div className="rankingNode">
                        <span>{d.rank}</span> <span>{d.userName}</span> <span>{d.rate}</span>
                    </div>
                )
            })}
            {topRanking.map(d => {
                return(
                    <div className="rankingNode">
                        <span>{d.rank}</span> <span>{d.userName}</span> <span>{d.rate}</span>
                    </div>
                )
            })}
            </div>

        </div>
    )
}

export default withRouter(Ranking)
