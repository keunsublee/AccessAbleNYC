import React, { useState } from 'react';
import { Offcanvas, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const FilterSideBar = ({ show, handleClose, onFilterChange }) => {
    const [locationType, setLocationType] = useState('');
    const [filterOptions, setFilterOptions] = useState({
        accessible: '',
        sensory_friendly: '',
        bathrooms: '',
        borough: '',
        restroom_type: '',
        station_line: '',
        ada_status: '',
        boardwalk: '',
        operator: '',
        ada_accessible_comfort_station: '',
        changing_station: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationTypeChange = (e) => {
        const selectedType = e.target.value;
        setLocationType(selectedType);
        setFilterOptions({
            accessible: '',
            sensory_friendly: '',
            bathrooms: '',
            borough: '',
            restroom_type: '',
            station_line: '',
            ada_status: '',
            boardwalk: '',
            operator: '',
            ada_accessible_comfort_station: '',
            changing_station: ''
        });
    };

    const handleApplyFilter = () => {
        const appliedFilters = { location_type: locationType };

        if (locationType === 'playground') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.sensory_friendly) appliedFilters["Sensory-Friendly"] = filterOptions.sensory_friendly;
            if (filterOptions.ada_accessible_comfort_station) appliedFilters["ADA_Accessible_Comfort_Station"] = filterOptions.ada_accessible_comfort_station;
        } else if (locationType === 'beach') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.bathrooms) appliedFilters.Bathrooms = filterOptions.bathrooms;
            if (filterOptions.boardwalk) appliedFilters.Boardwalk = filterOptions.boardwalk;
        } else if (locationType === 'pedestrian_signal') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.borough) appliedFilters.borough = filterOptions.borough;
        } else if (locationType === 'restroom') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.restroom_type) appliedFilters.restroom_type = filterOptions.restroom_type;
            if (filterOptions.operator) appliedFilters.operator = filterOptions.operator;
            if (filterOptions.changing_station) appliedFilters.changing_station = filterOptions.changing_station;
        } else if (locationType === 'subway_stop') {
            if (filterOptions.accessible) appliedFilters.Accessible = filterOptions.accessible;
            if (filterOptions.station_line) appliedFilters.station_line = filterOptions.station_line;
            if (filterOptions.ada_status) appliedFilters.ADA_Status = filterOptions.ada_status;
        }

        onFilterChange(appliedFilters);
        handleClose();
    };

    const handleResetFilters = () => {
        setLocationType('');
        setFilterOptions({
            accessible: '',
            sensory_friendly: '',
            bathrooms: '',
            borough: '',
            restroom_type: '',
            station_line: '',
            ada_status: '',
            boardwalk: '',
            operator: '',
            ada_accessible_comfort_station: '',
            changing_station: ''
        });
        onFilterChange({});  // Clear all filters in the parent component
        handleClose();
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end">
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
                                    <option value="">Any</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
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

                            {locationType === 'beach' && (
                                <>
                                    <Col>
                                        <Form.Label>Bathrooms</Form.Label>
                                        <Form.Select name="bathrooms" onChange={handleChange} value={filterOptions.bathrooms}>
                                            <option value="">Any</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label>Boardwalk</Form.Label>
                                        <Form.Select name="boardwalk" onChange={handleChange} value={filterOptions.boardwalk}>
                                            <option value="">Any</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
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
                                            <option value="Both Single-Stall All Gender and Multi-Stall W/M">Both Single-Stall Multi-Stall W/M</option>
                                        </Form.Select>
                                    </Col>
                                </>
                            )}

                            {locationType === 'subway_stop' && (
                                <>
                                    <Col>
                                        <Form.Label>ADA Status</Form.Label>
                                        <Form.Select name="ada_status" onChange={handleChange} value={filterOptions.ada_status}>
                                            <option value="">Any</option>
                                            <option value="Full ADA Access">Full ADA Access</option>
                                            <option value="Partial ADA Access">Partial ADA Access</option>
                                        </Form.Select>
                                    </Col>
                                </>
                            )}
                        </Row>
                    )}

                    <Button className="mt-3" variant="primary" onClick={handleApplyFilter}>
                        Apply Filter
                    </Button>
                    <Button className="mt-3 ms-2" variant="secondary" onClick={handleResetFilters}>
                        Reset Filters
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default FilterSideBar;
