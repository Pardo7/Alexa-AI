import request from 'request';

// Configuring our post requests
export const initiateClearInterface = () => {
	request({
		url: 'http://47e990b7.ngrok.io/clear',
		qs: { from: 'Sudo Alexa AI', data: 'Clear Preferences' },
		method: 'POST'
	}, (error, response, body) => {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
};

export const triggerInputInterface = data => {
	request({
		url: 'http://47e990b7.ngrok.io/inverse',
		qs: { from: 'Sudo Alexa AI', data: data },
		method: 'POST'
	}, (error, response, body) => {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
};

export const initNeural = () => {
	request({
		url: 'http://47e990b7.ngrok.io/connect',
		qs: { from: 'Sudo Alexa AI', data: 'init neural' },
		method: 'POST'
	}, (error, response, body) => {
		if (error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
};