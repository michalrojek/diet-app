import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


//TODO: divide components to container and presentional components i.e. list component, modal component
class ShoppingList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            isModalOpen: false
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

    submitData = (event) => {
        event.preventDefault();
        console.log(event.target.exampleEmail.value)
    }

    render() {
        const { items } = this.state;
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
                                    <Label for="exampleEmail">Email</Label>
                                    <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" onChange={this.onChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input name="username" id="username" placeholder="username" onChange={this.onChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="examplePassword">Password</Label>
                                    <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" onChange={this.onChange}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="confirmPassword">Confirm password</Label>
                                    <Input 
                                        invalid={this.state.invalidPassword}
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        placeholder="confirm password"
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
