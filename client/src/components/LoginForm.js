import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import Auth from '../modules/Auth';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }
    }

    onChange = (e) => {
        e.preventDefault();
        const { value, id } = e.target;
        if (id === "exampleEmail") {
            this.setState({email: value});
        } else {
            this.setState({password: value});
        }
    }

    //TODO: handle errors
    onSubmit = (e) => {
        e.preventDefault();
        if (!this.state.invalidPassword || !this.state.confirmPassword) {
            axios.post('http://localhost:5000/api/Users/login', {
                email: this.state.email,
                password: this.state.password
            }).then((response) => {
                console.log(response)
                Auth.authenticateUser(response.data.id);
                this.props.history.push('/');
                window.location.reload(false); 
            })
        }
    }    

    render() {
        return (
            <Container>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" onChange={this.onChange}/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" onChange={this.onChange}/>
                    </FormGroup>
                    <Button>Login</Button>
                </Form>
            </Container>
        )
    }
}

export default LoginForm;
