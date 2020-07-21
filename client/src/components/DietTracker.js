import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import ShoppingList from './ShoppingList';

class DietTracker extends Component {
    constructor(props) {
        super(props);

        // Keep different arrays for breakfast, lunch, dinner and snacks
        this.state = {
            items: [
                { id: uuidv4(), name: 'Eggs' },
                { id: uuidv4(), name: 'Milk' },
                { id: uuidv4(), name: 'Steak' },
                { id: uuidv4(), name: 'Water' }
            ]
        }
    }

    render() {
        const { items } = this.state;
        return (
            <Container>
                <h3>Breakfast</h3>
                <ShoppingList/>
                <h3>Lunch</h3>
                <ShoppingList/>
                <h3>Dinner</h3>
                <ShoppingList/>
                <h3>Snacks</h3>
                <ShoppingList/>
            </Container>
        );
    }
}

export default DietTracker;
