import React, { useState } from 'react';
import '../style/AddBar.css';



//this was our search bar implementation if you needed the reference
return (
    <div className="add-bar">
        <form className="d-flex" onSubmit={handleSearchSubmit}>
            <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
                style={{ borderRadius: '20px' }}
            />
            <button className="btn btn-outline-success custom-b" type="submit" >
                Search
            </button>
        </form>
        {searchResults.length > 0 && (
            <div className="dropdown-menu show position-absolute">
                {searchResults.map((result, index) => (
                    <button key={index} className="dropdown-item" onClick={() => handleLocationSelection(result.Name)}>
                        {result.Name}
                    </button>
                ))}
            </div>
        )}
    </div>
);