const conn = require('./conn');
const { STRING, UUID, UUIDV4, TEXT } = conn.Sequelize;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// to run locally, create a secrets.js file in the root directory and add a local JWT variable
if (process.env.NODE_ENV === 'development') require('../../secrets');

const JWT = process.env.JWT;

const User = conn.define('user', {
	id: {
		type: UUID,
		primaryKey: true,
		defaultValue: UUIDV4,
	},
	email: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'All users must have an email address on file.',
			},
			isEmail: {
				msg: 'Entered email is not a valid email address.',
			},
		},
		unique: true,
	},
	password: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'Please enter a password.',
			},
		},
	},
	firstName: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'Please enter your first name',
			},
		},
	},
	lastName: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'Please enter your last name',
			},
		},
	},
	avatar: {
		type: TEXT,
		get: function () {
			const prefix = 'data:image/png;base64,';
			const data = this.getDataValue('avatar');

			if (!data) {
				return data;
			}

			if (data.startsWith('data:image/')) {
				return data;
			}

			return `${prefix}${data}`;
		},
	},
});

User.prototype.getLocker = async function () {
	const locker = await conn.models.shoe.findAll({
		where: {
			userId: this.id,
		},
	});
	if (!locker) {
		return [];
	}
	return locker;
};

User.addHook('beforeSave', async (user) => {
	if (user.changed('password')) {
		user.password = await bcrypt.hash(user.password, 5);
	}
});

User.findByToken = async function (token) {
	try {
		const { id } = jwt.verify(token, process.env.JWT);
		const user = await this.findByPk(id);
		if (user) {
			return user;
		}
		throw 'user not found';
	} catch (ex) {
		const error = new Error('bad credentials');
		error.status = 401;
		throw error;
	}
};

User.prototype.generateToken = function () {
	return jwt.sign({ id: this.id }, JWT);
};

User.authenticate = async function ({ email, password }) {
	const user = await this.findOne({
		where: {
			email,
		},
	});
	if (user && (await bcrypt.compare(password, user.password))) {
		return jwt.sign({ id: user.id }, JWT);
	}
	const error = new Error('bad credentials');
	error.status = 401;
	throw error;
};

module.exports = User;
