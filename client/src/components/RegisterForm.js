import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, FormFeedback } from 'reactstrap';
import axios from 'axios';

class RegisterForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            invalidPassword: false
        }
    }

    onChange = (e) => {
        e.preventDefault();
        const { value, id } = e.target;
        if (id === "exampleEmail") {
            this.setState({email: value});
        } else if (id === "username") {
            this.setState({username: value});
        } else if (id === "examplePassword") {
            this.setState({password: value});
        } else if (id === "confirmPassword") {
            const invalidPassword = this.state.password !== value;
            this.setState({confirmPassword: value, invalidPassword});
        }
    }

    //TODO: check for existing emails and usernames?
    //TODO: some kind of min password character count
    //TODO: send user to login page
    onSubmit = (e) => {
        e.preventDefault();
        if (!this.state.invalidPassword || !this.state.confirmPassword) {
            axios.post('http://localhost:5000/api/Users', {
                email: this.state.email,
                username: this.state.username,
                password: this.state.password
            }).then((response) => {
                console.log(response)
                this.props.history.push('/login');
                window.location.reload(false); 
            })
        }
    }    

    render() {
        const feedback = this.state.invalidPassword ? <FormFeedback>Password dont match!</FormFeedback> : null;
        return (
            <Container>
                <Form onSubmit={this.onSubmit}>
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
                        {feedback}
                    </FormGroup>
                    <Button>Register</Button>
                </Form>
            </Container>
        )
    }
}

export default RegisterForm;
