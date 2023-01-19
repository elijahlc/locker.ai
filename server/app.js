const express = require('express');
const app = express();
const path = require('path');

app.use(express.json({ limit: '50mb' }));

app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/api/auth', require('./api/auth'));
app.use('/api/shoes', require('./api/shoes'));
app.use('/api/image', require('./api/image'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../static/index.html')));

app.use((err, req, res, next) => {
	if (err.message && !err.errors) {
		res.status(err.status || 500).send({ error: err.message });
	} else {
		res.status(err.status || 500).send(err.errors);
	}
});

module.exports = app;
