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
import Auth from '../modules/Auth';

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

    //TODO: reload page on logout - reload appnavbar
    //TODO: add axios request to logout endpoint in Auth.js -> deauthentiacteUser()
    render() {
        let routes = (
            <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link to="/register" className="nav-link">
                                        Register
                                    </Link>
                                </NavItem>
                            </Nav>
                        </Collapse>
          )
        
            if (Auth.isUserAuthenticated()) {
              routes = (
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
                                <NavItem>
                                    <Link to="/" className="nav-link" onClick={Auth.deauthentiacteUser}>
                                        Logout
                                    </Link>
                                </NavItem>
                            </Nav>
                        </Collapse>
              )
            }

        return (
            <div>
                <Navbar color="dark" dark expand="sm" className="mb-5">
                    <Container>
                        <NavbarBrand href="/">DietApp</NavbarBrand>
                        <NavbarToggler onClick={this.toggle}/>
                        {routes}
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default AppNavbar;