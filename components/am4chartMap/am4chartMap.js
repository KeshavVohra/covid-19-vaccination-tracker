import React, { Component } from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

// import AnimateNumber from 'react-animated-number';
import s from './am4chartMap.module.scss';


class Am4chartMap extends Component {

    componentDidMount() {
        let map = am4core.create("map", am4maps.MapChart);
        map.percentHeight = 100;
        map.projection = new am4maps.projections.Albers();
        map.homeZoomLevel = 1;

        map.seriesContainer.draggable = false;
        map.seriesContainer.resizable = false;


        let mapSeries = map.series.push(new am4maps.MapPolygonSeries());
        mapSeries.useGeodata = true;
        mapSeries.geodataSource.url = this.props.report.map.geoDataSource;
        mapSeries.geodataSource.events.on("done", (ev) => {
            map.goHome(0);
            mapSeries.appear();
        });
        mapSeries.geodataSource.load();

        let mapPolygon = mapSeries.mapPolygons.template;
        mapPolygon.tooltipText = "{name}";
        mapPolygon.nonScalingStroke = true;
        mapPolygon.strokeOpacity = 0.5;
        mapPolygon.stroke = am4core.color("#6979C9");
        mapPolygon.fill = am4core.color("#474D84");

        // Set up click events
        mapPolygon.events.on("hit", (ev) => {
            let targetType = ev.target.dataItem.dataContext.TYPE;
            console.log(targetType)
            if (targetType === "Province" || targetType === "Territory") {
                ev.target.series.chart.zoomToMapObject(ev.target);
                this.props.onClick(ev.target.dataItem.dataContext.id)
            }
        });

        let hoverState = mapPolygon.states.create("hover");
        hoverState.properties.fill = am4core.color("#354D84");
        let homeButton = map.chartContainer.createChild(am4core.Button);
        homeButton.events.on("hit", () => {
            map.goHome()
            this.props.onClick("ca")
        });
        homeButton.icon = new am4core.Sprite();
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.icon.path = "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z";
        homeButton.icon.fill = am4core.color("#6E8192");
        homeButton.marginBottom = 10;
        homeButton.align = 'right';
        homeButton.valign = 'top';
        homeButton.background.fill = am4core.color("#0000003d");
        homeButton.background.stroke = am4core.color("#0000003d");
        homeButton.dy = 0;

        let homeButtonHoverState = homeButton.background.states.create("hover");
        homeButtonHoverState.properties.fill = am4core.color("#0000003d");

        this.map = map;
        this.mapSeries = mapSeries
    }

    componentWillUnmount() {
        if (this.map) {
            this.map.dispose();
        }
    }

    componentDidUpdate(oldProps) {
        if (oldProps.report !== this.props.report) {
            this.mapSeries.hide()
            setTimeout(() => {
                this.mapSeries.geodataSource.url = this.props.report.map.geoDataSource;
                this.mapSeries.geodataSource.load();
            }, 1000)
        }
    }

    render() {
        return (
            <div className={s.mapChart}>
                <div className={s.map} id="map">
                </div>
            </div>
        );
    }
}

export default Am4chartMap;
