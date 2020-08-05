import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';

class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: {
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
        const {match: {params: {id}}} = this.props;
        axios.get(`http://localhost:5000/api/products/${id}`).then(({data}) => {
            this.setState(({items}) => {
                const itemsValues = Object.entries(data).map(([key, value]) => {
                    return [key, {...items[key], value}];
                });
                return {
                    items: {...Object.fromEntries(itemsValues)}
                };
            });
        })
    }

    render() {
        const { items } = this.state;
        return (
            <Container className="diet-tracker-list">
                <ListGroup>
                    {Object.entries(items).map(([key, {value}]) => (
                        <ListGroupItem>
                            {key}: {value}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Container>
        );
    }
}

export default Product;
