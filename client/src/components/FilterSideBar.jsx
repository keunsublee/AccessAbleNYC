import React, { useState } from 'react';
import { Offcanvas, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from './ThemeContext';
import '../style/FilterSideBar.css';

const FilterSideBar = ({ show, handleClose, onFilterChange }) => {
    const { theme } = useTheme();
    const [locationType, setLocationType] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        accessible: '',
        sensory_friendly: '',
        borough: '',
        restroom_type: '',
        ada_statuslayer: '',
        operator: '',
        ada_accessible_comfort_station: '',
    });
    
    // Handle individual filter option change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prev) => ({ ...prev, [name]: value }));
    };
    // Reset filter options when a new location type is selected
    const handleLocationTypeChange = (e) => {
        const selectedType = e.target.value;
        setLocationType(selectedType);
        setFilterOptions({
            accessible: '',
            sensory_friendly: '',
            borough: '',
            restroom_type: '',
            ada_statuslayer: '',
            operator: '',
            ada_accessible_comfort_station: ''
        });
    };
    // Apply selected filters to the onFilterChange function prop
    const handleApplyFilter = () => {
        const appliedFilters = { location_type: locationType };
         // Set filters specific to each location type
        if (locationType === 'playground') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.sensory_friendly) appliedFilters["Sensory-Friendly"] = filterOptions.sensory_friendly;
            if (filterOptions.ada_accessible_comfort_station) {
                const isAccessible = ['No', 'Not Accessible', 'NotAccessible'].includes(filterOptions.ada_accessible_comfort_station)
                    ? 'Not Accessible'
                    : 'Accessible';
                appliedFilters["ADA_Accessible_Comfort_Station"] = isAccessible;
            }
        } else if (locationType === 'beach') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
        } else if (locationType === 'pedestrian_signal') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.borough) appliedFilters.borough = filterOptions.borough;
        } else if (locationType === 'restroom') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.restroom_type) appliedFilters.restroom_type = filterOptions.restroom_type;
            if (filterOptions.operator) appliedFilters.operator = filterOptions.operator;
        } else if (locationType === 'subway_stop') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.ada_statuslayer) appliedFilters.ADA_StatusLayer = filterOptions.ada_statuslayer;
        }

        onFilterChange(appliedFilters);
        handleClose();
    };
    // Reset all filters and close the sidebar
    const handleResetFilters = () => {
        setLocationType('');
        setFilterOptions({
            accessible: '',
            sensory_friendly: '',
            borough: '',
            restroom_type: '',
            ada_statuslayer: '',
            operator: '',
            ada_accessible_comfort_station: ''
        });
        onFilterChange({});  // Clear all filters in the parent component
        handleClose();
    };
    //Handle diff values of "Accessible" field 
    const getAccessibleOptions = () => {
        switch (locationType) {
            case 'subway_stop':
                return ["Any", "Yes", "No", "Unknown", "Partial ADA"];
            case 'restroom':
                return ["Any", "Fully Accessible", "Not Accessible", "Partially Accessible"];
            default:
                return ["Any", "Yes", "No"];
        }
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" className={theme === 'dark' ? 'sidebar-dark' : ''}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Filter Locations</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Label>Location Type</Form.Label>
                            <Form.Select name="location_type" value={locationType} onChange={handleLocationTypeChange}>
                                <option value="">Select Type</option>
                                <option value="playground">Playground</option>
                                <option value="beach">Beach</option>
                                <option value="pedestrian_signal">Pedestrian Signal</option>
                                <option value="restroom">Restroom</option>
                                <option value="subway_stop">Subway Stop</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    {locationType && (
                        <Row className="mt-3">
                            <Col>
                                <Form.Label>Accessible</Form.Label>
                                <Form.Select name="accessible" onChange={handleChange} value={filterOptions.accessible}>
                                    {getAccessibleOptions().map((option) => (
                                        <option key={option} value={option === "Any" ? "" : option}>{option}</option>
                                    ))}
                                </Form.Select>
                            </Col>

                            {locationType === 'playground' && (
                                <>
                                    <Col>
                                        <Form.Label>Sensory-Friendly</Form.Label>
                                        <Form.Select name="sensory_friendly" onChange={handleChange} value={filterOptions.sensory_friendly}>
                                            <option value="">Any</option>
                                            <option value="Y">Yes</option>
                                            <option value="N">No</option>
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>ADA Accessible Comfort Station</Form.Label>
                                        <Form.Select name="ada_accessible_comfort_station" onChange={handleChange} value={filterOptions.ada_accessible_comfort_station}>
                                            <option value="">Any</option>
                                            <option value="Accessible">Accessible</option>
                                            <option value="Not Accessible">Not Accessible</option>
                                        </Form.Select>
                                    </Col>
                                </>
                            )}

                            {locationType === 'pedestrian_signal' && (
                                <Col>
                                    <Form.Label>Borough</Form.Label>
                                    <Form.Select name="borough" onChange={handleChange} value={filterOptions.borough}>
                                        <option value="">Any</option>
                                        <option value="Manhattan">Manhattan</option>
                                        <option value="Brooklyn">Brooklyn</option>
                                        <option value="Queens">Queens</option>
                                        <option value="Bronx">Bronx</option>
                                        <option value="Staten Island">Staten Island</option>
                                    </Form.Select>
                                </Col>
                            )}

                            {locationType === 'restroom' && (
                                <>
                                    <Col>
                                        <Form.Label>Restroom Type</Form.Label>
                                        <Form.Select name="restroom_type" onChange={handleChange} value={filterOptions.restroom_type}>
                                            <option value="">Any</option>
                                            <option value="Single-Stall All Gender Restroom(s)">Single-Stall</option>
                                            <option value="Multi-Stall W/M Restrooms">Multi-Stall</option>
                                            <option value="Both Single-Stall All Gender and Multi-Stall W/M">Both</option>
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>Operator</Form.Label>
                                        <Form.Select name="operator" onChange={handleChange} value={filterOptions.operator}>
                                            <option value="">Any</option>
                                            <option value="NYC Parks">NYC Parks</option>
                                            <option value="BPL">BPL</option>
                                            <option value="Park Avenue Plaza Owner LLC">Park Avenue Plaza Owner LLC</option>
                                            <option value="NYC DOT/JCDecaux">NYC DOT/JCDecaux</option>
                                        </Form.Select>
                                    </Col>
                                </>
                            )}

                            {locationType === 'subway_stop' && (
                                <Col>
                                    <Form.Label>ADA Status</Form.Label>
                                    <Form.Select name="ada_statuslayer" onChange={handleChange} value={filterOptions.ada_statuslayer}>
                                        <option value="">Any</option>
                                        <option value="Full ADA Access">Full ADA Access</option>
                                        <option value="Partial ADA Access">Partial ADA Access</option>
                                    </Form.Select>
                                </Col>
                            )}
                        </Row>
                    )}

                    <Button className="mt-3" variant="primary" onClick={handleApplyFilter}>
                        Apply Filter
                    </Button>
                    <Button className="mt-3 ms-2" variant="secondary" onClick={handleResetFilters}>
                        Clear
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default FilterSideBar;
