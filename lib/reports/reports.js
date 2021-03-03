const _geoDataSourceUrl = "https://www.amcharts.com/lib/4/geodata/json"
const _reportDataSourceUrl = "https://api.covid19tracker.ca/reports"

const _baseReports = [
    {
        id: "ca",
        name: "Canada",
        population: 38008005,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/canadaHigh.json`,
            reportDataSoruce: `${_reportDataSourceUrl}`
        }
    },
    {
        id: "ca-ab",
        name: "Alberta",
        population: 4428112,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/abLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/ab`
        }
    },
    {
        id: "ca-bc",
        name: "British Columbia",
        population: 5145851,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/bcLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/bc`
        }
    },
    {
        id: "ca-mb",
        name: "Manitoba",
        population: 1379584,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/mbLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/mb`
        }
    },
    {
        id: "ca-nb",
        name: "New Brunswick",
        population: 781315,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/nbLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/nb`
        }
    },
    {
        id: "ca-nl",
        name: "Newfoundland and Labrador",
        population: 520998,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/nlLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/nl`
        }
    },
    {
        id: "ca-ns",
        name: "Nova Scotia",
        population: 979115,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/nsLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/ns`
        }
    },
    {
        id: "ca-on",
        name: "Ontario",
        population: 14733119,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/onLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/on`
        }
    },
    {
        id: "ca-pe",
        name: "Prince Edward Island",
        population: 159713,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/peLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/pe`
        }
    },
    {
        id: "ca-qc",
        name: "Quebec",
        population: 8575779,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/qcLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/qc`
        }
    },
    {
        id: "ca-sk",
        name: "Saskatchewan",
        population: 1177884,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/skLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/sk`
        }
    },
    {
        id: "ca-nt",
        name: "Northwest Territories",
        population: 45074,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/ntLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/nt`
        }
    },
    {
        id: "ca-nu",
        name: "Nunavut",
        population: 39285,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/nuLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/nu`
        }
    },
    {
        id: "ca-yt",
        provinceCode: "yt",
        name: "Yukon",
        population: 42176,
        dataSources: {
            geoDataSource: `${_geoDataSourceUrl}/region/canada/ytLow.json`,
            reportDataSoruce: `${_reportDataSourceUrl}/province/yt`
        }
    }
]

export default class Reports {

    constructor() {
        this._baseReports = _baseReports;
    }

    async _fetchReportData(id) {
        const baseReport = this._getBaseReport(id)
        const res = await fetch(baseReport.dataSources.reportDataSoruce);
        const data = await res.json();
        return data;
    }

    _getBaseReport(id) {
        return this._baseReports.find(r => r.id === id);
    }

    _getVaccinationDataSeries(dataSet) {

        const indexOfFirstVaccinationDataSet = dataSet.findIndex(d => Number(d.change_vaccinations)> 0);
        const vaccinationDataSet = dataSet.slice(indexOfFirstVaccinationDataSet);

        const dosesAdministeredSeries = vaccinationDataSet.map(d => [Date.parse(d.date), d.change_vaccinations]);
        const runningPeriod = 7
        const dosesAdministered7DayAverageSeries = dosesAdministeredSeries.map((_item, index) => {
            if (index <= runningPeriod) {
              return [_item[0], 0];
            }
            const prev7DaysData = dosesAdministeredSeries.slice(index - runningPeriod, index);
            const prev7DaysTotal = prev7DaysData.reduce((acc, dayValue) => acc + dayValue[1], 0);
            return [_item[0], Math.round(prev7DaysTotal / 7)];
        });
        const firstDoseSeries = vaccinationDataSet.map(d => [Date.parse(d.date), d.change_vaccinations - d.change_vaccinated]);
        const secondDoseSeries = vaccinationDataSet.map(d => [Date.parse(d.date), d.change_vaccinated]);
        
        return {dosesAdministeredSeries, firstDoseSeries, secondDoseSeries, dosesAdministered7DayAverageSeries};
    }

    _compileReport(baseReport, reportData) {
        const dataSet = reportData.data;
        const latestDataSet = dataSet[dataSet.length - 1];
        const dosesUtilizationPercentage = (latestDataSet.total_vaccinations / latestDataSet.total_vaccines_distributed) * 100
        const vaccinatedPeople = latestDataSet.total_vaccinations - latestDataSet.total_vaccinated
        const vaccinatedPeoplePercentage = (vaccinatedPeople / baseReport.population) * 100
        const fullyVaccinatedPerPercentage = (latestDataSet.total_vaccinated / baseReport.population) * 100
        const {dosesAdministeredSeries, firstDoseSeries, secondDoseSeries, dosesAdministered7DayAverageSeries} = this._getVaccinationDataSeries(dataSet)
        return {
            name: baseReport.name,
            population: baseReport.population,
            map: {
                geoDataSource: baseReport.dataSources.geoDataSource
            },
            data: {
                dosesRecived: latestDataSet.total_vaccines_distributed,
                dosesAdministered: latestDataSet.total_vaccinations,
                dosesUtilizationPercentage: dosesUtilizationPercentage.toFixed(2),
                vaccinatedPer100People: vaccinatedPeoplePercentage.toFixed(2),
                vaccinatedPeople: vaccinatedPeople,
                fullyVaccinatedPer100People: fullyVaccinatedPerPercentage.toFixed(2),
                fullyVvaccinatedPeople: latestDataSet.total_vaccinated,
                dosesAdministeredSeries,
                firstDoseSeries,
                secondDoseSeries,
                dosesAdministered7DayAverageSeries
            }
        }
    }


    async getById(id) {
        if (!id) { return; }
        id = id.toLowerCase();
        let baseReport = this._getBaseReport(id)
        let reportData = await this._fetchReportData(id);
        let compiledReport = this._compileReport(baseReport, reportData);
        return compiledReport
    }

    getListOfReports() {
        return this._baseReports.map(r => r.id)
    }

}