import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { AppState } from '../store';
import { UserData, TeamDetail } from '../types';
import UserCard from '../component/UserCard';
import TeamSummary from '../component/TeamSummary';
import WeeklySummary from '../component/weeklySummary';

const URL = 'https://mock.onsd.now.sh'
const Index : React.FC = () => {

    const [isUserLoading, setIsUserLoading] = useState<boolean>(true)
    const [userData, setUserData] = useState<UserData>({rate:0, weeklyDistance:0,totalDistance:0,achievementRate:0})

    const [isTeamLoading, setIsTeamLoading] = useState<boolean>(true)
    const [teamData, setTeamData] = useState<TeamDetail>({
        teamGoal: 0,
        teamMember: [
            {
                userName: "",
                userData: {
                    "rate": 0,
                    "weeklyDistance": 0,
                    "totalDistance": 0,
                    "achievementRate": 0
                }
            }
        ]
    })

    const userState = useSelector((state: AppState) => state.userState)
    console.log(userState)
    useEffect(() => {
        console.log(userState.userId)
       axios.get(URL + '/user/' + userState.userId).then(res => {
           const userData = res.data as UserData
           setUserData(userData)
       }).then(
           () => setIsUserLoading(false)
        ).catch(() => setIsUserLoading(true))
    }, [userState])

    useEffect( () => {
        console.log(userState.teamID)
        axios.get(URL + '/team/'　+ userState.teamID).then(res => {
            const teamData = res.data as TeamDetail
            setTeamData(teamData)
        }).then(
            () => setIsTeamLoading(false)
        ).catch(
            () => setIsUserLoading(true)
        )
    }, [userState])

    return (
        <div>
            <WeeklySummary/>
            <header>
                <p>{userState.userName? userState.userName: 'Not logged in'}</p>
                <p>Setting</p>
            </header>
            {isUserLoading ?  <div>User Loading</div> : <UserCard userData={userData} /> }
            {isTeamLoading ?  <div>Team Loading</div> : <TeamSummary teamData={teamData}  /> }
        </div>
    )
}

export default Index;