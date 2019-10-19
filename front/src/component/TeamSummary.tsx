import React from "react";
import {  teamDetail } from '../types';
import { Doughnut } from 'react-chartjs-2'

type Props = {
    teamData: teamDetail;
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
// const data = {
// 	labels: [
// 		'Red',
// 		'Green',
//         'Yellow',
// 	],
// 	datasets: [{
// 		data: [300, 50, 100],
		// backgroundColor: [
		// '#FF6384',
		// '#36A2EB',
        // '#FFCE56',
		// ],
		// hoverBackgroundColor: [
		// '#FF6384',
		// '#36A2EB',
		// '#FFCE56'
		// ]
// 	}]
// };

const TeamSummary: React.FC<Props> = props => {
    const data: DataType = {
        labels:[],
        datasets:[{
            data:[],
            // backgroundColor: [],
            // hoverBackgroundColor: []
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
            ],
            hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ]
            }
        ]
    }
    props.teamData.teamMember.map(d => {
        data.labels.push(d.userName)
        data.datasets[0].data.push(d.userData.weeklyDistance)
    })
    return (
        <section onClick={() => console.log("clicked!")}>
            <p>チーム目標: {props.teamData.teamGoal}</p>
            <Doughnut data={data}/>
        </section>
    );
};

export default TeamSummary;
