import React, { Component } from 'react';
import { Container, ListGroup, ListGroupItem, Form, FormGroup, Label, Input} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';

//TODO should there be some kind of breadcrumbs?
//TODO ADD SENSORY EVALUATION
//TODO ADD REQUEST AND AUTHENTICATION FOR USERS RATING AND COMMENTS
//TODO ADD VALIDATION ON COMMENT AND RATING
//TODO ADD comments
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
            },
            rating: 0,
            ratingId: ''
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
        const filter = `{"where": {"and": [{"userId": "${localStorage.getItem('userId')}"}, {"productId": "${id}"}]}}`;
        //const filter = `{"where": {"userId": ${id}}}`
        axios.get(`http://localhost:5000/api/Ratings?filter=${filter}`).then(({data}) => {
            if (data.length){
                this.setState({rating: data[0].value, ratingId: data[0].id});
            }
        });
    }

    onChange = (e) => {
        e.preventDefault();
        const {target: {value}} = e;
        const {match: {params: {id}}} = this.props;
        const {ratingId} = this.state;
        if (ratingId) {
            axios.put('http://localhost:5000/api/Ratings', {
                productId: id,
                userId: localStorage.getItem('userId') ,
                value,
                id: ratingId
            }).then((response) => {
                console.log(response)
                this.setState({rating: value, ratingId: response.data.id});
            })
        } else {
            axios.post('http://localhost:5000/api/Ratings', {
                productId: id,
                userId: localStorage.getItem('userId') ,
                value
            }).then((response) => {
                console.log(response)
                this.setState({rating: value, ratingId: response.data.id});
            })
        }
    }

    render() {
        const { items, rating } = this.state;
        const radioButtons = [];
        for (let i = 0; i < 5; i++) {
            radioButtons.push(
                <FormGroup>
                    <Label check>
                        <Input type="radio" name={`radio${i+1}`} value={i+1} checked={rating == i + 1}/>{` ${i+1}`}
                    </Label>
                </FormGroup>
            )
        }
        return (
            <Container className="diet-tracker-list">
                <ListGroup>
                    {Object.entries(items).map(([key, {value}]) => (
                        <ListGroupItem>
                            {key}: {value}
                        </ListGroupItem>
                    ))}
                </ListGroup>
                <Form onChange={this.onChange}>
                    <legend className="col-form-label col-sm-2">Rating</legend>
                    {radioButtons}
                </Form>
            </Container>
        );
    }
}

export default Product;
