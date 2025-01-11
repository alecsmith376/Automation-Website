const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        const data = JSON.parse(event.body); // Parse incoming form data
        const { name, email, message } = data;

        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing fields. Please fill out all fields.' }),
            };
        }

        // Send data to Zapier with `querystring` keys
        const response = await fetch('https://hooks.zapier.com/hooks/catch/21274903/2zwyz5w/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                querystring: {
                    name,
                    email,
                    message,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Error from Zapier: ${response.statusText}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Form submitted successfully!' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to submit form. Please try again.' }),
        };
    }
};
