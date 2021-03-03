import React from "react";

import { Card } from "react-bootstrap";
import ApexChart from "react-apexcharts";

import styles from "./chart.module.scss";

class Chart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            options: {
                chart: {
                    height: 350,
                    type: "bar",
                    stacked: false,
                    toolbar: {
                        tools: {
                            download: false,
                            selection: true,
                            zoom: true,
                            zoomin: true,
                            zoomout: true,
                            pan: false,
                            reset: true
                        }
                    }
                },
                legend: {
                    show: true,
                    position: 'bottom',
                    horizontalAlign: 'right',
                    labels: {
                        colors: "#e0e0e1",
                    }
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    show: true,
                    curve: 'smooth',
                    width: [2, 1, 4],
                    dashArray: 0,
                },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        style: {
                            fontSize: "14px",
                        },
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            color: "#e0e0e1",
                        },
                    },
                    lines: {
                        show: false,
                    },
                    
                },
                tooltip: {
                    theme: "dark",
                    enabledOnSeries: [0,1],
                    followCursor: true,
                    shared: true
                },
                grid: {
                    show: false
                },
                colors: ['#2d8515', '#FFF']
            }
        }
    }

    render() {
        return (
            <Card className={styles.chartCard}>
                <header className={styles.chartCardTitle}>
                    <h4>Doses Administered by Day</h4>
                </header>
                <div className={styles.chartCardBody}>
                    <ApexChart
                        className="sparkline-chart"
                        height={350}
                        series={this.props.dataSeries}
                        options={this.state.options}
                        type={"bar"}
                    />
                </div>

            </Card>
        );
    }
}

export default Chart;
