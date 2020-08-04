import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


//TODO: divide components to container and presentional components i.e. list component, modal component, form component (inputs in props as in state here)
//TODO: prepare form for adding new product
//TODO: add function for posting form data to backend endpoint
//TODO: prepare list refreshing after adding new item
//TODO: check if this form of <Modal><Form><Modal> is really okay (seems to work)
//TODO: add some sort of validation to form, add message prompt after succesful add
//TODO: clear values in state after closing modal
class ShoppingList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            isModalOpen: false,
            inputs: {
                name: {
                    type: 'text',
                    value: ''
                },
                //TODO: change description to textarea
                description: {
                    type: 'text',
                    value: ''
                },
                //TODO: is step='any' okay for all umber fields?
                weight: {
                    type: 'number',
                    value: 0
                },
                //TODO change unit to combobox and put it in same line as weight
                unit: {
                    type: 'text',
                    value: ''
                },
                calories: {
                    type: 'number',
                    value: 0
                },
                protein: {
                    type: 'number',
                    value: 0
                },
                carbohydrates: {
                    type: 'number',
                    value: 0
                },
                fat: {
                    type: 'number',
                    value: 0
                }
            }
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        axios.get('http://localhost:5000/api/products').then(({data}) => {
            const items = [...data]
            this.setState({items});
        })
    }

    toggle = () => {
        this.setState({isModalOpen: !this.state.isModalOpen});
    }

    onChange = (e) => {
        e.preventDefault();
        const { value, id, type } = e.target;
        console.log(e.target)
        this.setState(({inputs}) => ({
            inputs: {...inputs, [id]: {...inputs[id], value: type === "number" ? parseFloat(value) : value}}
        }));
    }

    submitData = (e) => {
        e.preventDefault();
        const {inputs} = this.state
        const productEntries = Object.entries(inputs).map(([key, {value}]) => {
            return [key, value];
        });
        const product = Object.fromEntries(productEntries);
        axios.post('http://localhost:5000/api/products', product).then((response) => {
            console.log(response)
            this.toggle();
            window.location.reload(false); 
        })
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const { items, inputs } = this.state;
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
                            {Object.entries(inputs).map(([key, {type, value}]) => (
                                <FormGroup>
                                    <Label for={key}>{this.capitalizeFirstLetter(key)}</Label>
                                    <Input type={type} step="any" name={key} id={key} placeholder={this.capitalizeFirstLetter(key)} value={value} onChange={this.onChange}/>
                                </FormGroup>
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Submit</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <ListGroup>
                    <TransitionGroup className="shopping-list">
                        {items.map(({ id, name }) => (
                            <CSSTransition key={id} timeout={500} classNames="fade">
                                <ListGroupItem>
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            this.setState(state => ({
                                                items: state.items.filter(item => item.id !== id)
                                            }));
                                        }}
                                    >&times;</Button>
                                    {name}
                                </ListGroupItem>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </ListGroup>
            </Container>
        );
    }
}

export default ShoppingList;
