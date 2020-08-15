import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';

class Goal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            calories: 0,
            carbohydrates: 0,
            protein: 0,
            fat: 0,
            id: ''
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const filter = `{"where": {"userId": "${localStorage.getItem('userId')}"}}`;
        axios.get(`http://localhost:5000/api/Goals?filter=${filter}`).then(({data}) => {
            if (data.length) {
                const {calories, carbohydrates, protein, fat, id} = data[0];
                this.setState({calories, carbohydrates, protein, fat, id});
            }
        });
    };

    onChange = (e) => {
        e.preventDefault();
        const { value, id } = e.target;
        this.setState({[id]: value});
    }

    onSubmit = (e) => {
        e.preventDefault();
        const {id, calories, carbohydrates, protein, fat} = this.state;
        if (id) {
            axios.put('http://localhost:5000/api/Goals', {
                userId: localStorage.getItem('userId'),
                calories,
                carbohydrates,
                protein,
                fat,
                id
            }).then((response) => {
                console.log(response)
            })
        } else {
            axios.post('http://localhost:5000/api/Goals', {
                userId: localStorage.getItem('userId'),
                calories,
                carbohydrates,
                protein,
                fat
            }).then((response) => {
                console.log(response)
            })
        }
    }

    //autocomplete="off" - add some kind of my own autocomplete?
    render() {
        const {calories, carbohydrates, protein, fat} = this.state;
        return (
            <Container>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="calories">Calories</Label>
                        <Input
                            type="number"
                            name="calories"
                            id="calories"
                            placeholder="Calories"
                            onChange={this.onChange}
                            autocomplete="off"
                            value={calories}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="carbohydrates">Carbohydrates</Label>
                        <Input
                            type="number"
                            name="carbohydrates"
                            id="carbohydrates"
                            placeholder="carbohydrates in grams"
                            onChange={this.onChange}
                            autocomplete="off"
                            value={carbohydrates}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="protein">Protein</Label>
                        <Input
                            type="number"
                            name="protein"
                            id="protein"
                            placeholder="protein in grams"
                            onChange={this.onChange}
                            autocomplete="off"
                            value={protein}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="fat">Fat</Label>
                        <Input
                            type="number"
                            name="fat"
                            id="fat"
                            placeholder="fat in grams"
                            onChange={this.onChange}
                            autocomplete="off"
                            value={fat}
                        />
                    </FormGroup>
                    <Button>Submit</Button>
                </Form>
            </Container>
        )
    }
}

export default Goal;
