import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/NavBar.css'
import { Link } from 'react-router-dom';

//main navbar used throughout each webpage
function NavBar() {
  const [isAuthenticated,setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = (event) => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to='/'>AccessAbleNYC</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to='/'>Home</Nav.Link>
              <Nav.Link as={Link} to='/feedback'>Feedback</Nav.Link>
            </Nav>
            {isAuthenticated ? (
              <Nav>
                <Nav.Link as={Link} to='/profile'>Profile</Nav.Link>
                <Nav.Link as={Link} to='/login' onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link as={Link} to='/login'>Log In</Nav.Link>
                <Nav.Link as={Link} to='/register'>Sign Up</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default NavBar;