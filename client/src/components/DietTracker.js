import React, { Component } from 'react';
import { Container, Button, Input, FormGroup, Label, Form, Table } from 'reactstrap';
import {Link, /*NavLink*/} from 'react-router-dom';
import EntryForm from './EntryForm';
import axios from 'axios';
import TableComponent from './TableComponent';

const PAGE_SIZE = 2;
//MAYBE ADD KG TO LB CONVERTER TO WEIGHT GOAL?
class DietTracker extends Component {
    constructor(props) {
        super(props);

        // Keep different arrays for breakfast, lunch, dinner and snacks
        this.state = {
            date: new Date().toJSON().slice(0,10),
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: [],
            goal: {},
            columns: [
                {label: 'Name', id: 'name'},
                {label: 'Calories', id: 'calories'},
                {label: 'Protein', id: 'protein'},
                {label: 'Carbohydrates', id: 'carbohydrates'},
                {label: 'Fat', id: 'fat'},
                {label: '', id: 'remove'}
            ],
            shouldGetData: true,
            weight: 0,
            weightId: '',
            latestDate: new Date().toJSON().slice(0,10)
        }
    }

    componentDidMount() {
        this.getData();
        this.getUserGoal();
        this.getWeight();
    }

    //AFTER ADDING DATE TO GOAL THIS SHOULD BE CALLED IN COMPONENTDIDUPDATE TOO
    getUserGoal = () => {
        const filter = `{"where": {"userId": "${localStorage.getItem('userId')}"}}`;
        axios.get(`http://localhost:5000/api/Goals?filter=${filter}`).then(({data}) => {
            if (data.length) {
                const {calories, carbohydrates, protein, fat, id} = data[0];
                this.setState({goal: {calories, carbohydrates, protein, fat, id}});
            }
        });
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.date != prevState.date || this.state.shouldGetData) {
            this.getData();
            this.getWeight();
        }
    }

    getProductsIdsByType = (data, type) => {
        return data.filter(({type: dbType}) => {
            return type === dbType;
        }).map(({productId}) => productId);
    }

    getProductsByIds = (data, ids, entries, type) => {
        const products = data.filter(({id}) => {
            return ids.includes(id);
        });
        return products.map((product) => {
            const trackerEntry = entries.find(({productId}) => {
                return productId === product.id;
            });
            const onClick = () => {
                this.setState(state => ({
                    [type]: state[type].filter(row => product.id !== row.id)
                }));
            };
            return {
                ...product,
                name: <Link to={`/list/${product.id}`}>{product.name}</Link>,
                calories: parseFloat((product.calories * trackerEntry.multiplier).toFixed(2)),
                carbohydrates: parseFloat((product.carbohydrates * trackerEntry.multiplier).toFixed(2)),
                protein: parseFloat((product.protein * trackerEntry.multiplier).toFixed(2)),
                fat: parseFloat((product.fat * trackerEntry.multiplier).toFixed(2)),
                remove: <Button className="remove-btn" color="danger" size="sm" onClick={onClick}>&times;</Button>
            };
        });
    }

    getData = () => {
        const {date} = this.state;
        const filter = `{"where": {"and": [{"userId": "${localStorage.getItem('userId')}"}, {"date": "${date}"}]}}`;
        axios.get(`http://localhost:5000/api/Entries?filter=${filter}`).then(({data: entries}) => {
            if (entries.length){
                console.log(entries)
                const breakfastIds = this.getProductsIdsByType(entries, "breakfast");
                const lunchIds = this.getProductsIdsByType(entries, "lunch");
                const dinnerIds = this.getProductsIdsByType(entries, "dinner");
                const snacksIds = this.getProductsIdsByType(entries, "snacks");
                const ids = entries.map(({productId}) => productId);
                let idsString = ids.reduce((result, current) => {
                    return `${result}"${current}",`;
                }, '');
                idsString = idsString.slice(0, idsString.length - 1);
                const productsFilter = `{"where": {"id": {"inq": [${idsString}]}}}`;
                console.log(productsFilter)
                axios.get(`http://localhost:5000/api/products?filter=${productsFilter}`).then(({data}) => {
                    if (data.length){
                        console.log(data)
                        const breakfast = this.getProductsByIds(data, breakfastIds, entries, 'breakfast');
                        const lunch = this.getProductsByIds(data, lunchIds, entries, 'lunch');
                        const dinner = this.getProductsByIds(data, dinnerIds, entries, 'dinner');
                        const snacks = this.getProductsByIds(data, snacksIds, entries, 'snacks');
                        this.setState({breakfast, lunch, dinner, snacks, shouldGetData: false});
                    }
                });
            } else {
                this.setState({breakfast: [], lunch: [], dinner: [], snacks: [], shouldGetData: false})
            }
        });
    }

    getWeight = () => {
        const {date} = this.state;
        const filter = `{"where": {"and": [{"userId": "${localStorage.getItem('userId')}"}, {"date": "${date}"}]}}`;
        axios.get(`http://localhost:5000/api/Weights?filter=${filter}`).then(({data}) => {
            if (data.length){
                this.setState({weight: data[0].weight, weightId: data[0].id, latestDate: data[0].date.slice(0,10)});
            } else {
                //ADD LAST RECORDED WEIGHT
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

    onChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        this.setState({date: value})
    }

    refreshTables = () => {
        this.setState({shouldGetData: true});
    }

    onSubmit = (e) => {
        e.preventDefault();
        const {date, weight, weightId} = this.state;
        if (!weightId) {
            axios.post('http://localhost:5000/api/Weights', {
                userId: localStorage.getItem('userId'),
                date,
                weight
            }).then((response) => {
                this.setState({weightId: response.data.id});
                //window.location.reload(false); 
            })
        } else {
            axios.put('http://localhost:5000/api/Weights', {
                userId: localStorage.getItem('userId'),
                date,
                weight,
                id: weightId
            }).then((response) => {
                console.log(response)
                //window.location.reload(false); 
            })
        }
    }

    onWeightChange = (e) => {
        e.preventDefault();
        const {value} = e.target;
        this.setState({weight: value});
    }

    //ADD SUPPORT FOR DELETING ENTRY FROM DATABASE
    //MAYBE ADD INFO ABOUT PORTION SIZE?
    //ADD PRECENTAGE TO GOAL TABLE
    //SHOULD I KEEP NEGATIVE VALUES IN REMAINING ROW OF GOAL TABLE
    //CHANGE GOAL TABLE TO TABLECOMPONENT
    render() {
        const { 
            breakfast, lunch, dinner, snacks, goal, columns, weight, weightId, latestDate
        } = this.state;
        const everyEntry = [...breakfast, ...lunch, ...dinner, ...snacks];
        const sum = everyEntry.reduce((result, {calories, carbohydrates, protein, fat}) => {
            return {
                calories: result.calories + calories,
                carbohydrates: result.carbohydrates + carbohydrates,
                protein: result.protein + protein,
                fat: result.fat + fat
            }
        }, {
            calories: 0,
            carbohydrates: 0,
            protein: 0,
            fat: 0
        });
        const weightButtonLabel = weightId ? 'Update todays weight entry' : 'Add todays weight entry'
        return (
            <Container>
                <Form>
                    <FormGroup>
                        <Label for="datePicker">Date</Label>
                        <Input type="date" name="datePicker" id="datePicker" placeholder="Choose date" onChange={this.onChange} value={this.state.date}/>
                    </FormGroup>
                </Form>
                <span>Last recorded weight: {weight} on {latestDate}</span>
                <Form onSubmit={this.onSubmit} inline>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="weight" className="mr-sm-2">Your weight for today</Label>
                        <Input type="number" name="weight" id="weight" placeholder="Today weight" step="any" value={weight} onChange={this.onWeightChange}/>
                    </FormGroup>
                    <Button>{weightButtonLabel}</Button>
                </Form>
                <h3>Breakfast</h3>
                <EntryForm type="breakfast" date={this.state.date} refreshTables={this.refreshTables}></EntryForm>
                <TableComponent columns={columns} rows={breakfast}/>
                <h3>Lunch</h3>
                <EntryForm type="lunch" date={this.state.date} refreshTables={this.refreshTables}></EntryForm>
                <TableComponent columns={columns} rows={lunch}/>
                <h3>Dinner</h3>
                <EntryForm type="dinner" date={this.state.date} refreshTables={this.refreshTables}></EntryForm>
                <TableComponent columns={columns} rows={dinner}/>
                <h3>Snacks</h3>
                <EntryForm type="snacks" date={this.state.date} refreshTables={this.refreshTables}></EntryForm>
                <TableComponent columns={columns} rows={snacks}/>
                <h3>Your Goal</h3>
                <Table hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Calories</th>
                            <th>Protein</th>
                            <th>Carbohydrates</th>
                            <th>Fat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Sum</th>
                            <th>{sum.calories}</th>
                            <th>{sum.protein}</th>
                            <th>{sum.carbohydrates}</th>
                            <th>{sum.fat}</th>
                        </tr>
                        <tr>
                            <th>Your Goal</th>
                            <th>{goal.calories}</th>
                            <th>{goal.protein}</th>
                            <th>{goal.carbohydrates}</th>
                            <th>{goal.fat}</th>
                        </tr>
                        <tr>
                            <th>Remaining</th>
                            <th>{(goal.calories - sum.calories).toFixed(2)}</th>
                            <th>{(goal.protein - sum.protein).toFixed(2)}</th>
                            <th>{(goal.carbohydrates - sum.carbohydrates).toFixed(2)}</th>
                            <th>{(goal.fat - sum.fat).toFixed(2)}</th>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default DietTracker;
