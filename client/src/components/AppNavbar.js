import React, { Component } from 'react';
import {Link, /*NavLink*/} from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';

class AppNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    /*
    dont know if I should leave Link components from react-router-dom
    these NavLink from reactstrap seem to work
    <NavItem>
        <Link to="/diet-tracker">
            <NavLink>
                Diet tracker
            </NavLink>
        </Link>
    </NavItem>
    <NavItem>
        <Link to="/diet-tracker-form">
            <NavLink>
                Form for diet tracker
            </NavLink>
        </Link>
    </NavItem>
    <NavItem>
        <Link to="/list">
            <NavLink>
                List
            </NavLink>
        </Link>
    </NavItem>

    but Link form react-router-dom doesn't cause page to reload
    with class straight from bootstrap seems to look and works just fine
    */
    render() {
        return (
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <Container>
                        <NavbarBrand href="/">DietApp</NavbarBrand>
                        <NavbarToggler onClick={this.toggle}/>
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Link to="/diet-tracker" className="nav-link">
                                        Diet tracker
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/diet-tracker-form" className="nav-link">
                                        Form for diet tracker
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/list" className="nav-link">
                                        List
                                    </Link>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default AppNavbar;