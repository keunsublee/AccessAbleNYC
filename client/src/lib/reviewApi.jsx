const API_URL = 'http://localhost:8080'; 

export const addReview = async (locationId, token, reviewData) => {
    try {
        const response = await fetch(`${API_URL}/review/${locationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reviewData), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to add review:', error.message);
        throw error; 
    }
};