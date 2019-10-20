import React from "react";
import "./styles.css";
import Chart from "react-apexcharts";

export function Gage(props) {
  function OPT(name) {
    const options = {
      colors: ["#77ee40", "#767676", "#ffd700"],

      chart: {
        stacked: true,
        toolbar: {
          show: false,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
          },
          autoSelected: "zoom"
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 0,
        colors: ["#fff"]
      },

      title: {
        text: undefined
      },
      xaxis: {
        categories: [name],
        labels: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        dropShadow: {
          enabled: false
        },

        title: {
          text: undefined
        }
      },
      yaxis: {
        title: {
          text: undefined
        },
        axisBorder: {
          show: false
        }
      },
      tooltip: {
        show: false,
        y: {
          formatter: function(val) {
            return val + "km";
          }
        }
      },
      fill: {
        opacity: 1
      },

      legend: {
        show: false
      }
    };
    return options;
  }
  function SRS(data) {
    var target = data[1];
    var now = data[0];
    var overtarget = now - target > 0 ? true : false;
    const series = [
      {
        name: "走行距離",
        data: [overtarget ? target : now]
      },
      {
        name: "残り",
        data: [overtarget ? 0 : target - now]
      },
      {
        name: "目標超え",
        data: [overtarget ? now - target : 0]
      }
    ];
    return series;
  }
  return (
    <div>
      <Chart
        options={OPT(props.name[0])}
        series={SRS(props.data[0])}
        type="bar"
        height="100"
      />
      <Chart
        options={OPT(props.name[1])}
        series={SRS(props.data[1])}
        type="bar"
        height="100"
      />
      <Chart
        options={OPT(props.name[2])}
        series={SRS(props.data[2])}
        type="bar"
        height="100"
      />
      <Chart
        options={OPT(props.name[3])}
        series={SRS(props.data[3])}
        type="bar"
        height="100"
      />
    </div>
  );
}
