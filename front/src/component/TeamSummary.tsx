import React, { useState, useEffect } from "react";
import {  TeamDetail } from '../types';
import { Circle } from "./Circle";

type Props = {
    teamData: TeamDetail;
};
type DataType = {
    labels: Array<string>;
    datasets: Array<DatasetType> 
}

type DatasetType = {
    data: Array<number>;
    backgroundColor : Array<string>;
    hoverBackgroundColor: Array<string>;
}

const TeamSummary: React.FC<Props> = props => {
    const [data, setData] = useState<DataType>({
        labels:[],
        datasets:[{
            data:[],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#00cc00",
                "#FFCE56",
                "#FFFFFF"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#00cc00",
                "#FFCE56",
                "#FFFFFF"
            ]
            }
        ]
    })
    useEffect(() => {  
        props.teamData.teamMember.map(d => {
        data.labels.push(d.userName)
        data.datasets[0].data.push(d.userData.weeklyDistance)
        })

        data.datasets[0].data.push(props.teamData.teamGoal)
        data.labels.push("NULL")
    },[])

    return (
        <section onClick={() => console.log("clicked!")}>
            <p>チーム目標: {props.teamData.teamGoal}</p>
            <Circle name={data.labels} data={data.datasets[0].data}/>
        </section>
    );
};

export default TeamSummary;
