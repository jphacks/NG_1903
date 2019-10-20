import React from 'react';
import {Card} from 'react-bootstrap'

import "./css/WeeklySummary.css"

const WeeklySummary : React.FC = () => {
    return (
        <Card className="mx-auto" style={{ width: '22rem'}}>
            <p className="weeklyReport">今週のレポート</p>
            <p className="main">10/21 ~ 10/28</p>
        </Card>
    )
}

export default WeeklySummary