const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('./middleware');
const { User, Shoe } = require('../db');

app.get('/', isLoggedIn, async (req, res, next) => {
	try {
		const user = req.user;
		res.send(await user.getLocker());
	} catch (ex) {
		next(ex);
	}
});

app.post('/', isLoggedIn, async (req, res, next) => {
	try {
		res.send(await Shoe.create(req.body));
	} catch (ex) {
		next(ex);
	}
});

app.delete('/:id', isLoggedIn, async (req, res, next) => {
	try {
		const shoe = await Shoe.findByPk(req.params.id);
		await shoe.destroy();
		res.sendStatus(204);
	} catch (ex) {
		next(ex);
	}
});

app.put ('/:id', isLoggedIn, async (req, res, next) => {
	try {
		const shoe = await Shoe.findByPk(req.params.id);
		await shoe.update(req.body);
		res.send(shoe);

	} catch (ex) {
		next(ex);
	}
})

module.exports = app;
