import React from 'react';
import './Modal.css';

const Modal = ({ message, title, isOpen, onClose }) => {
    if (!isOpen) {
        return null; 
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2> 
                <div dangerouslySetInnerHTML={{ __html: message }} /> 
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;



