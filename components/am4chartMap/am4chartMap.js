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

// import React, { useLayoutEffect } from 'react';

// import * as am4core from "@amcharts/amcharts4/core";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import am4geodata_canadaHigh from "@amcharts/amcharts4-geodata/canadaHigh";
// import * as am4maps from "@amcharts/amcharts4/maps";

// /* Chart code */
// // Themes begin
// am4core.useTheme(am4themes_animated);
// // Themes end

// const Am4chartMapaps = () => {

//     onStateSelect((state) => {
//         console.log(state)
//         // countrySeries.hide();
//         // stateSeries.show();
//     })
//     useLayoutEffect(() => {

//         // Create map instance
//         let map = am4core.create("map", am4maps.MapChart);
//         chart.projection = new am4maps.projections.Albers();

//         // Create map polygon series for country map
//         let countrySeries = map.series.push(new am4maps.MapPolygonSeries());
//         countrySeries.useGeodata = true;
//         countrySeries.geodata = am4geodata_canadaHigh;


//         let countryPolygon = worldSeries.mapPolygons.template;
//         countryPolygon.tooltipText = "{name}";
//         countryPolygon.nonScalingStroke = true;
//         countryPolygon.strokeOpacity = 0.5;
//         countryPolygon.stroke = am4core.color("#6979C9");
//         countryPolygon.fill = am4core.color("#474D84");
//         //countryPolygon.propertyFields.fill = "color";

//         let hs = countryPolygon.states.create("hover");
//         hs.properties.fill = am4core.color("#354D84");


//         // Create country specific series (but hide it for now)
//         let stateSeries = map.series.push(new am4maps.MapPolygonSeries());
//         stateSeries.useGeodata = true;
//         stateSeries.hide();
//         stateSeries.geodataSource.events.on("done", onStateSelect);

//         // let countryPolygon = countrySeries.mapPolygons.template;
//         // countryPolygon.tooltipText = "{name}";
//         // countryPolygon.nonScalingStroke = true;
//         // countryPolygon.strokeOpacity = 0.5;
//         // countryPolygon.fill = am4core.color("#eee");

//         // let hsc = countryPolygon.states.create("hover");
//         // hsc.properties.fill = chart.colors.getIndex(9);

//         // Set up click events
//         countryPolygon.events.on("hit", function (ev) {
//             ev.target.series.chart.zoomToMapObject(ev.target);
//             let map = ev.target.dataItem.dataContext.name.toLowerCase();
//             console.log(map)
//             if (map) {
//                 ev.target.isHover = false;
//                 stateSeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + map + "Low.json";
//                 stateSeries.geodataSource.load();
//             }
//         });

//         // Set up data for countries
//         //   let data = [];
//         //   for(var id in am4geodata_data_countries2) {
//         //     if (am4geodata_data_countries2.hasOwnProperty(id)) {
//         //       let country = am4geodata_data_countries2[id];
//         //       if (country.maps.length) {
//         //         data.push({
//         //           id: id,
//         //           color: chart.colors.getIndex(continents[country.continent_code]),
//         //           map: country.maps[0]
//         //         });
//         //       }
//         //     }
//         //   }
//         //   worldSeries.data = data;

//         // Zoom control
//         chart.zoomControl = new am4maps.ZoomControl();

//         let homeButton = new am4core.Button();
//         homeButton.events.on("hit", function () {
//             worldSeries.show();
//             countrySeries.hide();
//             chart.goHome();
//         });

//         homeButton.icon = new am4core.Sprite();
//         homeButton.padding(7, 5, 7, 5);
//         homeButton.width = 30;
//         homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
//         homeButton.marginBottom = 10;
//         homeButton.parent = chart.zoomControl;
//         homeButton.insertBefore(chart.zoomControl.plusButton);

//     }, [])
//     return (
//         <div id="map" style={{ width: "50%", height: "500px" }}></div>
//     )
// }

// export default Am4chartMapaps;


