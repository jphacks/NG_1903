import React from "react";
import { Doughnut } from "react-chartjs-2";
import "./styles.css";

export function Circle(props) {
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
            100 +
          "%",
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 1.75;

      ctx.fillText(text, textX, textY);
    }
  });

  const data = {
    labels: ["Tatimati", "jp", "Ichikawa", "koki"],
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
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#00cc00",
          "#FFCE56",
          "#FFFFFF"
        ],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
      }
    ]
  };

  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
}
