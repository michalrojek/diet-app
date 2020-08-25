import React, { Component } from 'react';
import { Container, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';

import TableComponent from "../components/TableComponent";

const PAGE_SIZE = 2;
//TODO: divide components to container and presentional components i.e. list component, modal component, form component (inputs in props as in state here)
//TODO: prepare list refreshing after adding new item
//TODO: check if this form of <Modal><Form><Modal> is really okay (seems to work)
//TODO: add some sort of validation to form, add message prompt after succesful add
//TODO: ADD VALIDATION IN GENERAL FOR ANY TYPE OF REQUEST
//TODO: clear values in state after closing modal
//TODO: add possibility for moderator to delete item (request to backend)
class ProductsList extends Component {
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
            },
            columns: [
                {label: 'Name', id: 'name'},
                {label: 'Weight', id: 'weight'},
                {label: 'Calories', id: 'calories'},
                {label: 'Protein', id: 'protein'},
                {label: 'Carbohydrates', id: 'carbohydrates'},
                {label: 'Fat', id: 'fat'},
                {label: '', id: 'remove'}
            ],
            productsCount: 0,
            page: 1
        }
    }

    componentDidMount() {
        this.getData();
        this.getProductsCount();
    }

    componentDidUpdate(prevProps, prevState) {
        const {page} = this.state;
        if (page !== prevState.page) {
            this.getData();
        }
    }

    getData = () => {
        const {page} = this.state;
        const skip = PAGE_SIZE * (page - 1);
        axios.get(`http://localhost:5000/api/products?filter[limit]=${PAGE_SIZE}&filter[skip]=${skip}`).then(({data}) => {
            const items = data.map((item) => {
                const onClick = () => {
                    this.setState(state => ({
                        rows: state.rows.filter(row => item.id !== row.id)
                    }));
                };
                return {
                    ...item,
                    name: <Link to={`/list/${item.id}`}>{item.name}</Link>,
                    remove: <Button className="remove-btn" color="danger" size="sm" onClick={onClick}>&times;</Button>
                };
            });
            this.setState({items});
        });
    }

    getProductsCount = () => {
        axios.get('http://localhost:5000/api/products/count').then(({data}) => {
            this.setState({productsCount: data.count});
        });
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

    //BTW: looks like list already refreshes itself after adding new product so there's no need to update
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

    changePage = (pageNumber) => {
        this.setState({page: pageNumber});
    }

    render() {
        const { items, inputs, columns, productsCount, page } = this.state;
        const tableProps = {
            columns,
            rows: items,
            rowsCount: productsCount,
            pageSize: PAGE_SIZE,
            currentPage: page,
            changePage: this.changePage,
            showPagination: true
        }
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
                <TableComponent {...tableProps}/>
            </Container>
        );
    }
}

export default ProductsList;
