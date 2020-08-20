import React, { Component } from 'react';
import { Container, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';

class TableComponent extends Component {
    constructor(props) {
        super(props);
    }

    /*
    ADD THIS TRANSITION FOR REMOVING ITEMS?
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
                        <Link to={`/list/${id}`}>
                            {name}
                        </Link>
                    </ListGroupItem>
                </CSSTransition>
            ))}
        </TransitionGroup>
    </ListGroup>
    */

    render() {
        const {columns, rows, rowsCount, pageSize} = this.props;
        const pageCount = Math.floor(rowsCount/pageSize);
        const pageNumbers = [];
        for (let i = 1; i <= pageCount; i++) {
            const pageNumber = (
                <PaginationItem>
                    <PaginationLink href="#">
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
            pageNumbers.push(pageNumber);
        }
        return (
            <Container>
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            {columns.map(({label}) => (
                                <th>{label}</th> 
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                            {rows.map((row, index) => (
                                <tr>
                                    <th scope="row">{index + 1}</th>
                                    {columns.map(({id}) => (
                                        <th>{row[id]}</th>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </Table>
                <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink previous href="#" />
                    </PaginationItem>
                    {pageNumbers}
                    <PaginationItem>
                        <PaginationLink next href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink last href="#" />
                    </PaginationItem>
                </Pagination>
            </Container>
        );
    }
}

export default TableComponent;
