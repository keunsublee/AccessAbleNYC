import React, { useState } from 'react';
import { Offcanvas, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from './ThemeContext';
import '../style/ReviewSideBar.css'

const ReviewSideBar = ({ show, handleClose, location, rating}) => {
    const { theme } = useTheme();

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" className={theme === 'dark' ? 'sidebar-dark' : ''}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{location.Name || location.Location || location.facility_name}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <p>Accessiblity Rating: {rating}</p>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ReviewSideBar;