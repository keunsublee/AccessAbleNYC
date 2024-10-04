import React, { useState } from 'react';
import './Footer.css';
import Modal from './Modal';


const Footer = () => {

    const[modalMessage,setModalMessage]=useState('');
    const[isModalOpen,setIsModalOpen]=useState(false);
    const[modalTitle,setModalTitle]=useState('');

    const handleLinkClick=(title,message)=>{
        setModalTitle(title);
        setModalMessage(message);
        setIsModalOpen(true);
    }

    

    const closeModal=()=>{
        setIsModalOpen(false);
    }
    const aboutContent = 
    `
        <strong>What is AccessAble NYC?</strong><br>
        AccessAble NYC is a web application designed to improve accessibility for individuals with disabilities by helping them find accessible locations across New York City. Our goal is to provide an easy-to-use, interactive platform that empowers people with mobility challenges to navigate the city.<br><br>

    `;
    const helpContent = 
    `   
        <strong>Who can use this app?</strong><br>
        The app is targeted towards people with special needs, as well as their family and friends, providing them with valuable information on accessible locations in NYC.<br><br>
        
        <strong>How do I navigate the interactive map?</strong><br>
        You can zoom in and out on the map to view different areas of NYC. Click on the markers to see more details about each location, including accessibility features and hours of operation.<

        <strong> Where does the data come from?</strong><br>
        Our data is sourced from NYC Open Data, which provides public datasets on accessible facilities in the city. We regularly update our platform to ensure that the information is current and reliable.<br><br>
    `;
    return (
        <footer className="footer">
            <h1 className="footer-title">AccessAble NYC.</h1>
            <nav className="nav">
            <div>
                <a href="/website" className="website-item">Website</a>
                <div className="link-container">
                <a href="#" onClick={()=>handleLinkClick('About Us', aboutContent)} className="about-item">About us</a>
                <a href="/" className="home-item">Home</a>
                </div>
            </div>

            <div>
                <a href="/contact" className="contact-item">Contact</a>
                <div className="link-container2">
                <a href="#" onClick={()=>handleLinkClick('Contact Information','Email us at:  accessablenyc@gmail.com')} className="email-item">Email</a>
                <a href="#" onClick={()=>handleLinkClick('Contact Information','Phone:  N/A')} className="phone-item">Phone</a>
                </div>
            </div>

            <div>
                <a href="/more" className="more-item">More</a>
                <div className="link-container3">
                <a href="/feedback" className="feedback-item">Feedback</a>
                <a href="#" onClick={()=>handleLinkClick('Help & FAQs',helpContent)} className="help-item">Help/FAQs</a>
                </div>
            </div>

            <div>
            {/*<a href="/follow" className="follow-item">Follow Us</a>*/}
                <div className="link-container3">
    
                </div>
            </div>
            </nav>
            <Modal message={modalMessage} title={modalTitle} isOpen={isModalOpen} onClose={closeModal} />
        </footer>
        
    );
};

export default Footer;