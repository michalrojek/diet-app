import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form, Table } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {Link, /*NavLink*/} from 'react-router-dom';
import EntryForm from './EntryForm';
import axios from 'axios';

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
            goal: {}
        }
    }

    componentDidMount() {
        this.getData();
        this.getUserGoal();
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
        if (this.state.date != prevState.date) {
            this.getData();
        }
    }

    getProductsIdsByType = (data, type) => {
        return data.filter(({type: dbType}) => {
            return type === dbType;
        }).map(({productId}) => productId);
    }

    getProductsByIds = (data, ids, entries) => {
        const products = data.filter(({id}) => {
            return ids.includes(id);
        });
        return products.map((product) => {
            const trackerEntry = entries.find(({productId}) => {
                return productId === product.id;
            });
            return {
                ...product,
                calories: product.calories * trackerEntry.multiplier,
                carbohydrates: product.carbohydrates * trackerEntry.multiplier,
                protein: product.protein * trackerEntry.multiplier,
                fat: product.fat * trackerEntry.multiplier
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
                        const breakfast = this.getProductsByIds(data, breakfastIds, entries);
                        const lunch = this.getProductsByIds(data, lunchIds, entries);
                        const dinner = this.getProductsByIds(data, dinnerIds, entries);
                        const snacks = this.getProductsByIds(data, snacksIds, entries);
                        this.setState({breakfast, lunch, dinner, snacks});
                    }
                });
            } else {
                this.setState({breakfast: [], lunch: [], dinner: [], snacks: []})
            }
        });
    }

    onChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        this.setState({date: value})
    }

    //MAKE TABLE COMPONENT
    //ADD SUPPORT FOR DELETING ENTRY FROM DATABASE
    //MAYBE ADD INFO ABOUT PORTION SIZE?
    //ADD PRECENTAGE TO GOAL TABLE
    //SHOULD I KEEP NEGATIVE VALUES IN REMAINING ROW OF GOAL TABLE
    render() {
        const { breakfast, lunch, dinner, snacks, goal } = this.state;
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
        return (
            <Container>
                <Form>
                    <FormGroup>
                        <Label for="datePicker">Date</Label>
                        <Input type="date" name="datePicker" id="datePicker" placeholder="Choose date" onChange={this.onChange} value={this.state.date}/>
                    </FormGroup>
                </Form>
                <h3>Breakfast</h3>
                <EntryForm type="breakfast" date={this.state.date}></EntryForm>
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Calories</th>
                            <th>Carbohydrates</th>
                            <th>Protein</th>
                            <th>Fat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakfast.map(({id, name, calories, carbohydrates, protein, fat, multiplier}, index) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <th>{name}</th>
                                <th>{calories.toFixed(2)}</th>
                                <th>{carbohydrates.toFixed(2)}</th>
                                <th>{protein.toFixed(2)}</th>
                                <th>{fat.toFixed(2)}</th>
                            </tr>    
                        ))}
                    </tbody>
                </Table>
                <h3>Lunch</h3>
                <EntryForm type="lunch" date={this.state.date}></EntryForm>
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Calories</th>
                            <th>Carbohydrates</th>
                            <th>Protein</th>
                            <th>Fat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lunch.map(({id, name, calories, carbohydrates, protein, fat, multiplier}, index) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <th>{name}</th>
                                <th>{calories.toFixed(2)}</th>
                                <th>{carbohydrates.toFixed(2)}</th>
                                <th>{protein.toFixed(2)}</th>
                                <th>{fat.toFixed(2)}</th>
                            </tr>    
                        ))}
                    </tbody>
                </Table>
                <h3>Dinner</h3>
                <EntryForm type="dinner" date={this.state.date}></EntryForm>
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Calories</th>
                            <th>Carbohydrates</th>
                            <th>Protein</th>
                            <th>Fat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dinner.map(({id, name, calories, carbohydrates, protein, fat, multiplier}, index) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <th>{name}</th>
                                <th>{calories.toFixed(2)}</th>
                                <th>{carbohydrates.toFixed(2)}</th>
                                <th>{protein.toFixed(2)}</th>
                                <th>{fat.toFixed(2)}</th>
                            </tr>    
                        ))}
                    </tbody>
                </Table>
                <h3>Snacks</h3>
                <EntryForm type="snacks" date={this.state.date}></EntryForm>
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Calories</th>
                            <th>Carbohydrates</th>
                            <th>Protein</th>
                            <th>Fat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {snacks.map(({id, name, calories, carbohydrates, protein, fat, multiplier}, index) => (
                            <tr>
                                <th scope="row">{index + 1}</th>
                                <th>{name}</th>
                                <th>{calories.toFixed(2)}</th>
                                <th>{carbohydrates.toFixed(2)}</th>
                                <th>{protein.toFixed(2)}</th>
                                <th>{fat.toFixed(2)}</th>
                            </tr>    
                        ))}
                    </tbody>
                </Table>
                <h3>Your Goal</h3>
                <Table hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Calories</th>
                            <th>Carbohydrates</th>
                            <th>Protein</th>
                            <th>Fat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Sum</th>
                            <th>{sum.calories}</th>
                            <th>{sum.carbohydrates}</th>
                            <th>{sum.protein}</th>
                            <th>{sum.fat}</th>
                        </tr>
                        <tr>
                            <th>Your Goal</th>
                            <th>{goal.calories}</th>
                            <th>{goal.carbohydrates}</th>
                            <th>{goal.protein}</th>
                            <th>{goal.fat}</th>
                        </tr>
                        <tr>
                            <th>Remaining</th>
                            <th>{(goal.calories - sum.calories).toFixed(2)}</th>
                            <th>{(goal.carbohydrates - sum.carbohydrates).toFixed(2)}</th>
                            <th>{(goal.protein - sum.protein).toFixed(2)}</th>
                            <th>{(goal.fat - sum.fat).toFixed(2)}</th>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default DietTracker;
