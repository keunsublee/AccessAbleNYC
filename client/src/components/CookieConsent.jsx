import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function CookieConsent({ onAccept }) {
    const [showConsent, setShowConsent] = useState(false);

    useEffect(() => {
        const consent = Cookies.get('cookieConsent');
        console.log('Consent cookie:', consent);
        if (!consent) {
            setShowConsent(true);
        }
    }, []);

    const handleAccept = () => {
        Cookies.set('cookieConsent', 'true', { expires: 365 });
        setShowConsent(false);
        onAccept();
    };

    if (!showConsent) return null;

    return (
        <div className="cookie-consent-banner">
            <p>We use cookies to enhance your experience. By using this site, you accept our cookie policy.</p>
            <button onClick={handleAccept}>Accept</button>
        </div>
    );
}

export default CookieConsent;
