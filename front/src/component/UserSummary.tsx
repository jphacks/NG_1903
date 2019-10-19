import React from "react";
import { UserData } from "../types";

type Props = {
    userData: UserData;
};

const UserSummary: React.FC<Props> = props => {
    return (
        <section>
            <p> レート: {props.userData.rate}</p>
            <p>今週の距離: {props.userData.weeklyDistance}</p>
            <p>総走行距離: {props.userData.totalDistance}</p>
            <p>達成率: {props.userData.achievementRate}</p>
        </section>
    );
};

export default UserSummary;
