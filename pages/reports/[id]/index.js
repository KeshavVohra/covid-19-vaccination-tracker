import { Component } from 'react'

import Head from 'next/head'
import dynamic from "next/dynamic";
import { withRouter } from 'next/router'

import { Row, Col } from 'react-bootstrap'
import Layout, { siteTitle } from '../../../components/layout/layout'
import StatsCard from '../../../components/statsCard/statsCard'

import Reports from "../../../lib/reports/reports"

const Map = dynamic(
    () => import("../../../components/am4chartMap/am4chartMap"),
    { ssr: false }
);

const Chart = dynamic(
    () => import(".../../../components/chart/chart"),
    { ssr: false }
);

class Report extends Component {

    async getReport(id) {
        return await new Reports().getById(id)
    }

    changeReport(id) {
        let report = this.getReport(id)
        this.setState({ report: report })
    }

    goToReport = (id) => {
        id = id.toLowerCase();
        this.props.router.push(`/reports/${id}`)
    }

    componentDidUpdate(prevProps) {
        const { pathname, query } = this.props.router
        if (query.id !== prevProps.router.query.id) {
            this.changeReport(query.id)
        }
    }

    render() {
        return (
            <Layout pageTitle={this.props.report.name} subTitle={`Population: ${this.props.report.population.toLocaleString()} est.`}>
                <Head>
                    <title>{siteTitle}</title>
                </Head>
                <Row>
                    <Col lg={7}>
                        <Map report={this.props.report} onClick={this.goToReport} />
                    </Col>
                    <Col>
                        <StatsCard title="Doses" stats={[
                            { "name": "Percent Utalized", "value": `${this.props.report.data.dosesUtilizationPercentage}%` },
                            { "name": "Administered", "value": this.props.report.data.dosesAdministered },
                            { "name": "Recived", "value": this.props.report.data.dosesRecived }]}
                            progressBars={[
                                { "value": this.props.report.data.dosesUtilizationPercentage }]}
                        />
                        <StatsCard title="Vaccinated" stats={[
                            { "name": "People Vaccinated Per 100", "value": this.props.report.data.vaccinatedPer100People },
                            { "name": "People Vaccinated", "value": this.props.report.data.vaccinatedPeople }]}
                            progressBars={[
                                { "value": this.props.report.data.vaccinatedPer100People }]}
                        />
                        <StatsCard title="Fully Vaccinated" stats={[
                            { "name": "People Fully Vaccinated Per 100", "value": this.props.report.data.fullyVaccinatedPer100People },
                            { "name": "People Fully Vaccinated", "value": this.props.report.data.fullyVvaccinatedPeople }]}
                            progressBars={[
                                { "value": 1.36 }]}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Chart dataSeries={[
                            { name: "Doses Administered", data: this.props.report.data.dosesAdministeredSeries, type: 'column' },
                            { name: "Running Daily Average", data: this.props.report.data.dosesAdministered7DayAverageSeries, type: "line" }
                            // {name: "Fisrt Dose Administered", data: this.props.report.data.firstDoseSeries},
                            // {name: "Second Dose Administered", data: this.props.report.data.secondDoseSeries}
                        ]} />
                    </Col>
                </Row>
            </Layout>
        )
    }
}

// This function gets called at build time
export async function getStaticPaths() {
    let paths = new Reports().getListOfReports().map(reportId => {
        return { params: { id: reportId } }
    });
    return { paths: paths, fallback: false }
}

export async function getStaticProps({ params }) {
    let report = await new Reports().getById(params.id)
    return {
        props: {
            report
        }
    }
}

export default withRouter(Report)