import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

/*
    THIS FORM IS PRETTY MUCH ENTRYFORM SO IT SHOULD BE DELETED LATER
    THIS FORM IS PRETTY MUCH ENTRYFORM SO IT SHOULD BE DELETED LATER
    THIS FORM IS PRETTY MUCH ENTRYFORM SO IT SHOULD BE DELETED LATER
*/


/*
    Decide whenever this form should be dynamic - meaning send request for result upon typing
    Or if it should have button that triggers search request
*/

class DietTrackerForm extends Component {

    constructor(props) {
        super(props);

        //Maybe this can be done better? Without two arrays
        //With search request one array should be enough
        this.state = {
            items: [
                { id: uuidv4(), name: 'Eggs' },
                { id: uuidv4(), name: 'Milk' },
                { id: uuidv4(), name: 'Steak' },
                { id: uuidv4(), name: 'Water' }
            ],
            showedItems: [
                { id: uuidv4(), name: 'Eggs' },
                { id: uuidv4(), name: 'Milk' },
                { id: uuidv4(), name: 'Steak' },
                { id: uuidv4(), name: 'Water' }
            ]
        }
    }

    onChange = (e) => {
        e.preventDefault();
        const { value: searchText } = e.target;
        this.setState(({items}) => ({
            showedItems: items.filter(({name}) => {
                //Regex?
                return name.toLowerCase().includes(searchText.toLowerCase());
            })
        }));
    }

    //autocomplete="off" - add some kind of my own autocomplete?
    //Good looking transistion on search? Look at TransitionGroup in ShoppingList.js
    render() {
        const { showedItems } = this.state;
        return (
            <Container>
                <Form>
                    <FormGroup>
                        <Label for="exampleSearch">Search for item</Label>
                        <Input
                            type="search"
                            name="search"
                            id="exampleSearch"
                            placeholder="Type to search"
                            onChange={this.onChange}
                            autocomplete="off"
                        />
                    </FormGroup>
                </Form>
                <ListGroup>
                    {showedItems.map(({ id, name }) => (
                        <CSSTransition key={id} timeout={500} classNames="fade">
                            <ListGroupItem>
                                {name}
                            </ListGroupItem>
                        </CSSTransition>
                    ))}
                </ListGroup>
            </Container>
        )
    }
}

export default DietTrackerForm;
