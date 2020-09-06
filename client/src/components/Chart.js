import React, { Component } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import axios from 'axios';

//MAKE IT ONLY GRAPHIC COMPONENT - WHOLE BUSINESS LOGIC SHOULD BE KEPT IN CONTAINERS
//LOOK THROUGH ALL FILES AND FORMAT THEM SIMILARLLY - E.G. CONRAINER INSTEAD OF DIV AS MAIN COMPONENT IN RETURN
class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData: {
                labels: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
                datasets: [
                    {
                        label: 'Population',
                        data: [
                            617594,
                            181045,
                            153060,
                            106519,
                            105162,
                            95072
                        ],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 99, 132, 0.6)'
                        ]
                    }
                ]
            }
        }
    }

    componentDidMount() {
        //this.getWeight();
    }

    getWeight = () => {
        const {date} = this.state;
        const filter = `{"where": {"and": [{"userId": "${localStorage.getItem('userId')}"}, {"date": "${date}"}]}}`;
        axios.get(`http://localhost:5000/api/Weights?filter=${filter}`).then(({data}) => {
            if (data.length){
                this.setState({weight: data[0].weight, weightId: data[0].id, latestDate: data[0].date.slice(0,10)});
            } else {
                const filterForEarlierDates = `{"where": {"and": [{"userId": "${localStorage.getItem('userId')}"}, {"date": {"lt": "${date}"}}]}}`;
                axios.get(`http://localhost:5000/api/Weights?filter=${filterForEarlierDates}`).then(({data}) => {
                    if (data.length){
                        const dates = data.map(({date}) => {
                            return date;
                        })
                        const max = new Date(Math.max.apply(null, dates.map(function(e) {
                            return new Date(e);
                        })));
                        console.log(dates);
                        console.log(max)
                        const latestEntry = data.find(({date}) => {
                            return new Date(date).getTime() === max.getTime();
                        })
                        console.log(latestEntry)
                        this.setState({weight: latestEntry.weight, weightId: '', latestDate: max.toJSON().slice(0,10)});
                    } else {
                        this.setState({weight: 0, weightId: '', latestDate: date});
                    }
                });
            }
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
                <Bar
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
