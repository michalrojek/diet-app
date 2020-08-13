import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form, Nav } from 'reactstrap';
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
            snacks: []
        }
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate() {
        //this.getData();
    }

    getProductsByType = (data, type) => {
        return data.filter(({type: dbType}) => {
            return type === dbType;
        })
    }

    getData = () => {
        const {date} = this.state;
        const filter = `{"where": {"and": [{"userId": "${localStorage.getItem('userId')}"}, {"date": "${date}"}]}}`;
        //const filter = `{"where": {"userId": ${id}}}`
        axios.get(`http://localhost:5000/api/Entries?filter=${filter}`).then(({data}) => {
            if (data.length){
                //AFTER THAT SEND REQUEST FOR DETAIL TO /API/PRODUCTS WITH MULTIPLE IDS PROVIDED FROM THIS REQUEST
                //LOOPBACK -> QUERY -> WHERE -> INQ OPERATOR
                console.log(data)
                const breakfast = this.getProductsByType(data, "breakfast");
                const lunch = this.getProductsByType(data, "lunch");
                const dinner = this.getProductsByType(data, "dinner");
                const snacks = this.getProductsByType(data, "snacks");
                this.setState({breakfast, lunch, dinner, snacks});
            }
        });
    }

    onChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        this.setState({date: value})
    }

    //MAKE LIST COMPONENT
    //ADD SUPPORT FOR DELETING ENTRY FROM DATABASE
    render() {
        const { breakfast, lunch, dinner, snacks } = this.state;
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
                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {breakfast.map(({ id, name }) => (
                            <CSSTransition key={id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            this.setState(state => ({
                                                breakfast: state.breakfast.filter(item => item.id !== id)
                                            }));
                                        }}
                                    >&times;</Button>
                                    <Link to={`/list/${id}`}>
                                        {name}
                                    </Link>
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
                <h3>Lunch</h3>
                <EntryForm type="lunch" date={this.state.date}></EntryForm>
                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {lunch.map(({ id, name }) => (
                            <CSSTransition key={id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            this.setState(state => ({
                                                lunch: state.lunch.filter(item => item.id !== id)
                                            }));
                                        }}
                                    >&times;</Button>
                                    <Link to={`/list/${id}`}>
                                        {name}
                                    </Link>
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
                <h3>Dinner</h3>
                <EntryForm type="dinner" date={this.state.date}></EntryForm>
                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {dinner.map(({ id, name }) => (
                            <CSSTransition key={id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            this.setState(state => ({
                                                dinner: state.dinner.filter(item => item.id !== id)
                                            }));
                                        }}
                                    >&times;</Button>
                                    <Link to={`/list/${id}`}>
                                        {name}
                                    </Link>
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
                <h3>Snacks</h3>
                <EntryForm type="snacks" date={this.state.date}></EntryForm>
                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {snacks.map(({ id, name }) => (
                            <CSSTransition key={id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            this.setState(state => ({
                                                snacks: state.snacks.filter(item => item.id !== id)
                                            }));
                                        }}
                                    >&times;</Button>
                                    <Link to={`/list/${id}`}>
                                        {name}
                                    </Link>
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

export default DietTracker;
