import React from 'react';
import "./css/WeeklySummary.css"

const WeeklySummary : React.FC = () => {
    return (
        <section className="header">
            <p className="weeklyReport">今週のレポート</p>
            <p className="main">10/21 ~ 10/28</p>
        </section>
    )
}

export default WeeklySummary