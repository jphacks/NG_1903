import React,{useState} from 'react';
import {Card} from 'react-bootstrap'
import { UserData } from "../types";
import { useSelector } from 'react-redux';
import { AppState } from '../store';
import { checkPropTypes } from 'prop-types';

type Props = {
    userData: UserData;
};

const UserCard : React.FC<Props> = (props) => {

    const userState = useSelector((state: AppState) => state.userState)

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{userState.userName? userState.userName: 'Not logged in'}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">RATE:{props.userData.rate}</Card.Subtitle>
                <Card.Text>
                    <b>{props.userData.weeklyDistance}</b>km走りました <br></br>
                    累計:{props.userData.totalDistance}km
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default UserCard;