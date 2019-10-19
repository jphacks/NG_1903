import React,{useState} from 'react';
import {Card} from 'react-bootstrap'
import { UserData } from "../types";
import { useSelector } from 'react-redux';
import { AppState } from '../store';
import "./css/UserCard.css"

type Props = {
    userData: UserData;
};

const UserCard : React.FC<Props> = (props) => {

    const userState = useSelector((state: AppState) => state.userState)

    return (
        <Card className="mx-auto" style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{userState.userName? userState.userName: 'Not logged in'}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-right">RATE:{props.userData.rate}</Card.Subtitle>
                <Card.Text className="text-center">
                    <span className="weeklyDistance">{props.userData.weeklyDistance}</span>km走りました <br></br>
                    <span className="mb-2 text-muted totalDistance">累計:{props.userData.totalDistance}km</span>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default UserCard;