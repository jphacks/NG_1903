import React from "react";
import "./styles.css";
import Chart from "react-apexcharts";

export function Week(props) {
  const state = {
    options: {
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
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val + "km";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: ["月", "火", "水", "木", "金", "土", "日"],
        position: "bottom",
        labels: {
          offsetY: 0
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: false,
          offsetY: -35
        }
      },
      fill: {
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function(val) {
            return val + "km";
          }
        }
      },
      title: {
        text: "",
        floating: true,
        offsetY: 320,
        align: "center",
        style: {
          color: "#444"
        }
      }
    },
    series: [
      {
        name: "走行距離",
        data: props.data
      }
    ]
  };
  return (
    <div>
      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        height="350"
      />
    </div>
  );
}
