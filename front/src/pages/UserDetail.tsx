import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {Card} from 'react-bootstrap'
import "./arrow.css";
import { Week } from "../component/showWeek"
import { UserData, UserState } from '../types';

const UserDetail: React.FC<RouteComponentProps>  = props => {
    const userDate = props.location.state.userData as UserData
    const userState = props.location.state.userState as UserState
    return (
        <div style={{
            backgroundColor: '#E5E5E5',
            height: '100vh',
          }}>
          <Card className="mx-auto" style={{ width: '22rem'}}>
            <div className="arrow" onClick={() => props.history.push("/")} />
            <p className="main">~ 10/28</p>
        </Card>
        <section>
            <span >マイレポート</span>
            <span onClick={() => props.history.push({pathname: "/ranking", state: {userData: userDate, userState: userState}})}>ランキング</span>
        </section>
        <Card className="mx-auto" style={{ width: '22rem'}}>
                <Card.Body>
                    <Card.Title>{userState.userName? userState.userName: 'Not logged in'}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-right">RATE:{userDate.rate}</Card.Subtitle>
                    <Card.Text className="text-center">
                        <span className="weeklyDistance">{userDate.weeklyDistance}</span>km走りました <br></br>
                        {/* <span className="mb-2 text-muted totalDistance">累計:{userState.totalDistance}km</span> */}
                        <Week data={[5.4, 6.4, 4.3, 2.2, 3.2, 1.0, 4.5]} />
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default withRouter(UserDetail)