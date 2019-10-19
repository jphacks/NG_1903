import React from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from 'chart.js'
import "./styles.css";

export function Circle(props) {
  var under100 =
    (props.data[0] + props.data[1] + props.data[2] + props.data[3]) /
      props.data[4] <
    1;
  var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
  Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
    draw: function() {
      originalDoughnutDraw.apply(this, arguments);

      var chart = this.chart;
      var width = chart.chart.width,
        height = chart.chart.height,
        ctx = chart.chart.ctx;
      var fontSize = (height / 114).toFixed(2);
      ctx.font = fontSize + "em sans-serif";
      ctx.textBaseline = "middle";

      var text =
          ((props.data[0] + props.data[1] + props.data[2] + props.data[3]) /
            props.data[4]) *
          100,
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 1.75;

      ctx.fillStyle = under100 ? "#6B6B6B" : "#e6b422";
      ctx.fillText(
        text.toFixed(0) + "%",
        under100 ? textX : textX + 120,
        textY
      );
    }
  });
  const colors = ["#FF6384", "#36A2EB", "#aa42f5", "#00cc00", "#FFFFFF"];
  const golds = ["#c69402", "#d6a412", "#e6b422", "#f6c432", "#FFFFFF"];

  const data = {
    datasets: [
      {
        data: [
          props.data[0],
          props.data[1],
          props.data[2],
          props.data[3],
          props.data[4] -
            (props.data[0] + props.data[1] + props.data[2] + props.data[3])
        ],
        backgroundColor: under100 ? colors : golds,
        hoverBackgroundColor: under100 ? colors : golds
      }
    ]
  };

  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
}
