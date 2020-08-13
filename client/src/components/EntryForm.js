import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form, Nav } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {Link, /*NavLink*/} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

class EntryForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            showedItems: [],
            isModalOpen: false,
            inputs: {
                name: {
                    type: 'text',
                    value: ''
                },
                portions: {
                    type: 'number',
                    value: 0
                }
            },
            portion: 1,
            selected: ''
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        axios.get('http://localhost:5000/api/products').then(({data}) => {
            const items = [...data]
            this.setState({items, showedItems: items});
        })
    }

    toggle = () => {
        this.setState({isModalOpen: !this.state.isModalOpen});
    }


    //this should send request for data with such text instead of just changing state
    searchForProduct = (e) => {
        e.preventDefault();
        const { value: searchText } = e.target;
        this.setState(({items}) => ({
            showedItems: items.filter(({name}) => {
                //Regex?
                return name.toLowerCase().includes(searchText.toLowerCase());
            })
        }));
    }

    onChange = (e) => {
        e.preventDefault();
        const { value, id } = e.target;
        if (id === "portion") {
            this.setState({portion: value});
        }
    }

    selectProduct = (e) => {
        e.preventDefault();
        const {id} = e.target;
        this.setState({selected: id});
    }

    //add validation if product isnt selected
    submitData = (e) => {
        e.preventDefault();
        const {selected, portion} = this.state;
        const {date, type} = this.props;
        if (selected) {
            axios.post('http://localhost:5000/api/Entries', {
                productId: selected,
                userId: localStorage.getItem('userId'),
                date,
                type,
                multiplier: portion
            }).then((response) => {
                console.log(response)
                this.toggle();
                window.location.reload(false); 
            })
        }
    }


    //Add nutrition info table under form
    render() {
        const { inputs, showedItems } = this.state;
        return (
            <Container className="diet-tracker-list">
                <Button
                    color="dark"
                    style={{marginBottom: '2rem'}}
                    onClick={this.toggle}
                >Add Item</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
                    <Form onSubmit={this.submitData}>
                        <ModalHeader toggle={this.toggle}>Add new product</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="exampleSearch">Search for item</Label>
                                <Input
                                    type="search"
                                    name="search"
                                    id="exampleSearch"
                                    placeholder="Type to search"
                                    onChange={this.searchForProduct}
                                    autocomplete="off"
                                />
                            </FormGroup>
                            <ListGroup>
                                <TransitionGroup className="shopping-list">
                                    {showedItems.map(({ id, name }) => (
                                        <CSSTransition key={id} timeout={500} classNames="fade">
                                            <ListGroupItem action active={this.state.selected===id} tag="button" onClick={this.selectProduct} id={id}>
                                                {name}
                                            </ListGroupItem>
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            </ListGroup>
                            <FormGroup>
                                <Label for="portion">Portion</Label>
                                <Input
                                    type="number"
                                    name="protion"
                                    id="portion"
                                    placeholder="Set portion size"
                                    step="any"
                                    value={this.state.portion}
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Submit</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </Container>
        );
    }
}

export default EntryForm;
