import { Gage } from "./Gage";
import React,{useState, useEffect} from 'react';
import { Card } from 'react-bootstrap'

import "./css/TeamCard.css"
import { TeamDetail } from '../types';

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

const TeamDetailComponent : React.FC<Props> = (props) => {
    const [remainDistance,setDistance] = useState<number>(props.teamData.teamGoal)
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
        let tmp = remainDistance
        props.teamData.teamMember.map(d => {
        data.labels.push(d.userName)
        data.datasets[0].data.push(d.userData.weeklyDistance)
        tmp-=d.userData.weeklyDistance
        })

        data.datasets[0].data.push(props.teamData.teamGoal)
        data.labels.push("NULL")
        setData(data)
        setDistance(tmp)
    },[])

    return (
            <Card className="mx-auto" style={{ width: '22rem' }}>
                <Card.Body>
                    <Card.Title>目標まであと{remainDistance}km</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted text-right">残り○日</Card.Subtitle>
                    <div className="text-center">
                    <Gage
                        name={data.labels}
                        data={[[100, 200], [130, 100], [20, 25], [200, 190]]}
                    />
                    </div>
                </Card.Body>
            </Card>
    )
}

export default TeamDetailComponent;