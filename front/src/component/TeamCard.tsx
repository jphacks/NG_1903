import React,{useState, useEffect} from 'react';
import { Card } from 'react-bootstrap'
import * as H from 'history';

import "./css/TeamCard.css"
import { TeamDetail } from '../types';
import { Circle } from "./Circle";

type Props = {
    teamData: TeamDetail;
    history: H.History
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

const TeamCard : React.FC<Props> = (props) => {
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
        <section onClick={() => props.history.push("/teamDetail")}> 
            <Card className="mx-auto" style={{ width: '22rem' }}>
                <Card.Body>
                    <Card.Title>{"目標まであと○○km"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-right">残り○日</Card.Subtitle>
                    <Card.Text className="text-center">
                        <Circle data={data.datasets[0].data}/>
                    </Card.Text>
                </Card.Body>
            </Card>
        </section>
    )
}

export default TeamCard;