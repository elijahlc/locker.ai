const express = require('express');
const { Configuration, OpenAIApi } = require('openai');

// to run locally, create a secrets.js file in the root directory and add your OpenAI API Key
if (process.env.NODE_ENV === 'development') require('../../secrets');

const app = express.Router();

module.exports = app;

app.post('/', async (req, res, next) => {
	try {
		const { prompt } = req.body;

		const configuration = new Configuration({
			apiKey: process.env.API_KEY,
		});

		const openai = new OpenAIApi(configuration);

		const response = await openai.createImage({
			prompt,
			n: 1,
			size: '512x512',
			response_format: 'b64_json',
		});

		res.send(response.data.data[0]['b64_json']);
	} catch (err) {
		next(err);
	}
});
