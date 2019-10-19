import React from "react";
import {  teamDetail } from '../types';

type Props = {
    teamData: teamDetail;
};

const TeamSummary: React.FC<Props> = props => {
    return (
        <section onClick={() => console.log("clicked!")}>
            <p>チーム目標: {props.teamData.teamGoal}</p>
            {props.teamData.teamMember.map(data => (
                <div>
                    <p>{data.userName}</p>
                    <p>{data.userData.weeklyDistance}</p>
                </div>
            ))}
        </section>
    );
};

export default TeamSummary;
