import React, {useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useTheme } from './ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/NavBar.css'
import { Link } from 'react-router-dom';

//main navbar used throughout each webpage
function NavBar() {
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const { theme } = useTheme();

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
      <Navbar className={`${theme}`} expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to='/' className={`${theme === 'light' ? '' : 'text-light'}`}>AccessAbleNYC</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to='/' className={`${theme === 'light' ? '' : 'text-light'}`}>Home</Nav.Link>
              <Nav.Link as={Link} to='/feedback' className={`${theme === 'light' ? '' : 'text-light'}`}>Feedback</Nav.Link>
            </Nav>
            {isAuthenticated ? (
              <Nav>
                <Nav.Link as={Link} to='/profile' className={`${theme === 'light' ? '' : 'text-light'}`}>Profile</Nav.Link>
                <Nav.Link as={Link} to='/login' onClick={handleLogout} className={`${theme === 'light' ? '' : 'text-light'}`}>Logout</Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link as={Link} to='/login' className={`${theme === 'light' ? '' : 'text-light'}`}>Log In</Nav.Link>
                <Nav.Link as={Link} to='/register' className={`${theme === 'light' ? '' : 'text-light'}`}>Sign Up</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default NavBar;