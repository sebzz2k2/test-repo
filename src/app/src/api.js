const API_URL = 'http://localhost:8000'; // Base URL for your API

const handleResponse = async (response) => {
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Something went wrong');
	}
	return response.json();
};

const apiRequest = async (endpoint, method = 'GET', data = null) => {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(`${API_URL}/${endpoint}`, options);
		return await handleResponse(response);
	} catch (error) {
		console.error('API Request Error:', error);
		throw error;
	}
};

export {apiRequest};
