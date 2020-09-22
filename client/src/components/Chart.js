import React, { Component } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import axios from 'axios';

//MAKE IT ONLY GRAPHIC COMPONENT - WHOLE BUSINESS LOGIC SHOULD BE KEPT IN CONTAINERS
//LOOK THROUGH ALL FILES AND FORMAT THEM SIMILARLLY - E.G. CONRAINER INSTEAD OF DIV AS MAIN COMPONENT IN RETURN
//ADD CHARTS FOR CALORIES, PROTEIN, FAT, CARBS
//CHANGE STYLING OF CHARTS AND LABELS
//ADD BUTTONS FOR PERIODS - 7, 30, 90, 180, 365, all
// MAYBE LOOK TROUGH CODE AND REFACTOR IT A LITTLE BIT
class Chart extends Component {
    constructor(props) {
        super(props);

        //7, 30, 90, 180, 365, all
        this.state = {
            lastDays: 90,
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Population',
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 99, 132, 0.6)'
                        ],
                        fill: false
                    }
                ]
            }
        }
    }

    componentDidMount() {
        this.getWeight();
    }

    getWeight = () => {
        const dates = [];
        for(let i = 0; i < this.state.lastDays; i++) {
            let date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0])
        }
        const filter = `{"where": {"userId": "${localStorage.getItem('userId')}"}}`;
        axios.get(`http://localhost:5000/api/Weights?filter=${filter}`).then(({data}) => {
            const {chartData} = this.state;
            const labels = data.map(({date}) => date);
            const values = dates.map(date => {
                const filteredWeight = data.find(({date: wieghtDate}) => {
                    return date == wieghtDate.slice(0,10);
                });
                if (filteredWeight) {
                    return filteredWeight.weight;
                }
                return 0;
            });
            let currentWeight = 0;
            const mappedValues = values.reduce((result, current) => {
                if (current != 0) {
                    currentWeight = current;
                }
                return [...result, currentWeight];
            }, []);
            console.log(values)
            this.setState({chartData: {...chartData, labels: dates, datasets: [{...chartData.datasets[0], data: mappedValues}]}});
        });
    }

    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPosition: 'right'
    }

    //ADD CONRAINER INSTEAD IF DIV
    render() {
        return (
            <div className="chart">
                <Line
                    data={this.state.chartData}
                    options={{
                        title: {
                            display: this.props.displayTitle,
                            text: 'Largest Cities In Massachusetts',
                            fontSize: 25
                        },
                        legend: {
                            display: this.props.displayLegend,
                            position: this.props.legendPosition
                        }
                    }}
                />
            </div>
        )
    }
}

export default Chart;
