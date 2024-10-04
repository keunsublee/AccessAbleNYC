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
      <Navbar bg="light" data-bs-theme="light" sticky='top'>
      <Container>
        <Navbar.Brand as={Link} to='/'>AccessAbleNYC</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to='/'>Home</Nav.Link>
          <Nav.Link as={Link} to='/feedback'>Feedback</Nav.Link>
        </Nav>
        {isAuthenticated ? (
          <Nav>
            <Link to='/profile'><Button variant='outline-primary' className='same-btn'>Profile</Button></Link>
            <Link to='/login'><Button variant='outline-primary' className='same-btn' onClick={handleLogout}>Logout</Button></Link>
          </Nav>
        ) : (
          <Nav>
            <Link to='/login'><Button variant='outline-primary' className='same-btn'>Log In</Button></Link>
            <Link to='/register'><Button variant='outline-primary' className='same-btn'>Sign Up</Button></Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  )
}

export default NavBar;