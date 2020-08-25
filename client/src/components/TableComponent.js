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

    nextPage = () => {
        const {rowsCount, pageSize, changePage, currentPage} = this.props;
        const pageCount = Math.floor(rowsCount/pageSize);
        if (currentPage !== pageCount) {
            changePage(currentPage + 1);
        }
    }

    previousPage = () => {
        const {changePage, currentPage} = this.props;
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    }

    render() {
        const {columns, rows, rowsCount, pageSize, changePage, showPagination} = this.props;
        let pagination = null;
        if (showPagination) {
            const pageCount = Math.ceil(rowsCount/pageSize);
            const pageNumbers = [];
            for (let i = 1; i <= pageCount; i++) {
                const pageNumber = (
                    <PaginationItem>
                        <PaginationLink href="" onClick={() => {changePage(i)}}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
                pageNumbers.push(pageNumber);
            }
            pagination = (
                <Pagination aria-label="Page navigation example">
                    <PaginationItem>
                        <PaginationLink first href="" onClick={() => {changePage(1)}}/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink previous href="" onClick={this.previousPage}/>
                    </PaginationItem>
                    {pageNumbers}
                    <PaginationItem>
                        <PaginationLink next href="" onClick={this.nextPage}/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink last href="" onClick={() => {changePage(pageCount)}}/>
                    </PaginationItem>
                </Pagination>
            );
        }
        //MAYBE DELETE THIS CONTAINER? REPLACE IT WITH BASIC DIV
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
                {pagination}
            </Container>
        );
    }
}

export default TableComponent;
