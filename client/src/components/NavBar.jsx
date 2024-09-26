import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/NavBar.css'
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <Navbar bg="light" data-bs-theme="light" sticky='top'>
        <Container>
          <Navbar.Brand as={Link} to='/'>AccessAbleNYC</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to='/'>Home</Nav.Link>
          </Nav>
          <Nav>
            <Link to='/login'><Button variant='outline-primary' className='same-btn'>Log In</Button></Link>
            <Link to='/register'><Button variant='outline-primary' className='same-btn'>Sign Up</Button></Link>
          </Nav>
        </Container>
      </Navbar>
    )
}

export default NavBar;