import request from 'request';

// Configuring our post requests
export const customRequestOne = () => {
	request({
		url: 'https://your.url.io/clear',
		qs: { from: 'My Alexa AI', data: data },
		method: 'POST'
	}, (error, response, body) => {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
};

export const customRequestTwo = data => {
	request({
		url: 'https://your.url.io/inverse',
		qs: { from: 'My Alexa AI', data: data },
		method: 'POST'
	}, (error, response, body) => {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
};

export const customRequestThree = () => {
	request({
		url: 'https://your.url.io/connect',
		qs: { from: 'My Alexa AI', data: data },
		method: 'POST'
	}, (error, response, body) => {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
};
