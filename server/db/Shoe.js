const { INTEGER } = require('sequelize');
const conn = require('./conn');
const { STRING, UUID, UUIDV4, TEXT } = conn.Sequelize;

const Shoe = conn.define('shoe', {
	id: {
		type: UUID,
		primaryKey: true,
		defaultValue: UUIDV4,
	},
	name: {
		type: STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'Shoe name cannot be empty',
			},
		},
	},
	image: {
		type: TEXT,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: 'Shoe must have an image',
			},
		},
		get: function () {
			const prefix = 'data:image/png;base64,';
			const data = this.getDataValue('image');

			if (!data) {
				return data;
			}

			if (data.startsWith(prefix)) {
				return data;
			}

			return `${prefix}${data}`;
		},
	},
	laceColor: {
		type: STRING,
		allowNull: false,
		defaultValue: '#FFFFFF',
	},
	tongueColor: {
		type: STRING,
		allowNull: false,
		defaultValue: '#FFFFFF',
	},
	soleColor: {
		type: STRING,
		allowNull: false,
		defaultValue: '#FFFFFF',
	},
	collarColor: {
		type: STRING,
		allowNull: false,
		defaultValue: '#FFFFFF',
	},
	tagColor: {
		type: STRING,
		allowNull: false,
		defaultValue: '#FFFFFF',
	},
	badgeColor: {
		type: STRING,
		allowNull: false,
		defaultValue: '#FFFFFF',
	},
	tongueStrapColor: {
		type: STRING,
		allowNull: false,
		defaultValue: '#FFFFFF',
	},
	eyeletsColor: {
		type: STRING,
		allowNull: false,
		defaultValue: '#FFFFFF',
	},
	scaleX: {
		type: INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
	scaleY: {
		type: INTEGER,
		defaultValue: 4,
		allowNull: false,
	},
	repeatAmount: {
		type: INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
	positionY: {
		type: INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

module.exports = Shoe;
