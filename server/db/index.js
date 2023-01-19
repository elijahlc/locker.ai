const fs = require('fs');
const path = require('path');

const conn = require('./conn');
const User = require('./User');
const Shoe = require('./Shoe');

Shoe.belongsTo(User);
User.hasMany(Shoe);

const getImage = (path) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path, 'base64', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

const syncAndSeed = async () => {
	const [eliAvatar, profAvatar, dogBestFriends, unicornHamburger, singingBetta, dogAvocado] = await Promise.all([
		getImage(path.join(__dirname, '../../static/eli.png')),
		getImage(path.join(__dirname, '../../static/prof.jpeg')),
		getImage(path.join(__dirname, '../../static/impressionist-dog-best-friends.png')),
		getImage(path.join(__dirname, '../../static/unicorn-eating-a-hamburger.png')),
		getImage(path.join(__dirname, '../../static/betta-fish-watercolor-singing-deep-blue-sea.png')),
		getImage(path.join(__dirname, '../../static/dog-eating-an-avocado-art-deco.png')),
	]);

	await conn.sync({ force: true });

	const [eli, olga, fernando, jackson, prof] = await Promise.all([
		User.create({ email: 'eli@locker.ai', password: '123', firstName: 'Eli', lastName: 'Cohen', avatar: eliAvatar }),
		User.create({ email: 'olga@locker.ai', password: '123', firstName: 'Olga', lastName: 'Matyukhina' }),
		User.create({ email: 'fernando@locker.ai', password: '123', firstName: 'Fernando', lastName: 'Herrera' }),
		User.create({ email: 'jackson@locker.ai', password: '123', firstName: 'Jackson', lastName: 'Spindle' }),
		User.create({
			email: 'prof@locker.ai',
			password: '123',
			firstName: 'Prof',
			lastName: 'Katz',
			avatar: profAvatar,
		}),
	]);

	await Promise.all([
		Shoe.create({
			name: 'impressionist dog best friends',
			image: dogBestFriends,
			userId: eli.id,
			laceColor: '#AF4649',
			tongueColor: '#E19914',
			soleColor: '#EBDC77',
			collarColor: '#89987D',
			tagColor: '#673672',
			badgeColor: '#56B2CC',
			tongueStrapColor: '#898989',
			eyeletsColor: '#EED4D4',
		}),
		Shoe.create({
			name: 'unicorn eating a hamburger',
			image: unicornHamburger,
			userId: prof.id,
			laceColor: '#AF4649',
			tongueColor: '#E19914',
			soleColor: '#EBDC77',
			collarColor: '#89987D',
			tagColor: '#673672',
			badgeColor: '#56B2CC',
			tongueStrapColor: '#898989',
			eyeletsColor: '#EED4D4',
		}),
		Shoe.create({
			name: 'betta fish watercolor singing deep blue sea',
			image: singingBetta,
			userId: prof.id,
			laceColor: '#01398F',
			tongueColor: '#0564C5',
			soleColor: '#EF9F7D',
			collarColor: '#8AC1DC',
			tagColor: '#96E5A2',
			badgeColor: '#F64E41',
			tongueStrapColor: '#4C5A5D',
			eyeletsColor: '#C7D7F1',
		}),
		Shoe.create({
			name: 'dog eating an avocado art deco',
			image: dogAvocado,
			userId: prof.id,
			laceColor: '#F0F06C',
			tongueColor: '#1C1C20',
			soleColor: '#0CA750',
			collarColor: '#F08D33',
			tagColor: '#4C260D',
			badgeColor: '#908E8E',
			tongueStrapColor: '#1A1A1E',
			eyeletsColor: '#0BA551',
		}),
	]);

	return {
		users: {
			eli,
			olga,
			fernando,
			jackson,
			prof,
		},
	};
};

module.exports = {
	syncAndSeed,
	User,
	Shoe,
};
