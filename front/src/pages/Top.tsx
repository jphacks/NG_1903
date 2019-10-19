import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../store';
import { UserData, teamDetail } from '../types';
import UserCard from '../component/UserCard';
import TeamCard from '../component/TeamCard';
import WeeklySummary from '../component/weeklySummary';

const userData: UserData = {
    "rate": 560,
    "weeklyDistance": 25.12,
    "totalDistance": 125,
    "achievementRate": 80
}
const teamData: teamDetail = {
    teamGoal: 200,
    teamMember: [
        {
            userName: "AAA",
            userData: {
                "rate": 560,
                "weeklyDistance": 13,
                "totalDistance": 125,
                "achievementRate": 80
            }
        },
        {
            userName: "BBB",
            userData: {
                "rate": 560,
                "weeklyDistance": 30,
                "totalDistance": 125,
                "achievementRate": 80
            }
        },
        {
            userName: "CCC",
            userData: {
                "rate": 560,
                "weeklyDistance": 50,
                "totalDistance": 125,
                "achievementRate": 80
            }
        },
        {
            userName: "DDD",
            userData: {
                "rate": 560,
                "weeklyDistance": 25.12,
                "totalDistance": 125,
                "achievementRate": 80
            }
        }
    ]
}

const Index : React.FC = () => {
    const [isUserLoaded, setIsUserLoaded] = useState<boolean>(true)
    const [isTeamLoaded, setIsTeadLoaded] = useState<boolean>(true)

    const userState = useSelector((state: AppState) => state.userState)

    return (
        <div>
            <header>
                <WeeklySummary/>
            </header>
            {isUserLoaded ?  <UserCard userData={userData} /> :  <div>User Loading</div>}
            <p　className="mb-2 text-muted">チームレポート</p>
            {isTeamLoaded ?  <TeamCard teamData={teamData}  /> : <div>Team Loaded</div>}
        </div>
    )
}

export default Index;