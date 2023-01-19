const { expect } = require('chai');
const { syncAndSeed, User } = require('../server/db');
const jwt = require('jsonwebtoken');
const app = require('supertest')(require('../server/app'));

// to test locally, create a secrets.js file in the root directory and add a local JWT variable
if (process.env.MODE === 'dev') require('../secrets');

describe('The Login Process', () => {
	let seed;

	beforeEach(async () => {
		seed = await syncAndSeed();
	});

	describe('api routes', () => {
		describe('POST /api/auth', () => {
			describe('valid credentials', () => {
				it('returns a token', async () => {
					const response = await app.post('/api/auth').send({ email: 'eli@locker.ai', password: '123' });
					expect(response.status).to.equal(200);
				});
			});
		});

		describe('GET /api/auth', () => {
			describe('valid token', () => {
				it('returns the user', async () => {
					const token = jwt.sign({ id: seed.users.olga.id }, process.env.JWT);
					const response = await app.get('/api/auth').set('authorization', token);
					expect(response.status).to.equal(200);
					expect(response.body.email).to.equal('olga@locker.ai');
				});
			});
		});
	});

	describe('password storage', () => {
		it('password is hashed', () => {
			expect(seed.users.eli.password).not.to.equal('123');
		});
		it('doesnt get rehashed when a user updates', async () => {
			const { eli } = seed.users;
			const password = eli.password;
			eli.email = 'eli@gmail.com';
			await eli.save();
			expect(password).to.equal(eli.password);
		});
	});

	describe('with correct credentials', () => {
		it('returns a jwt token', async () => {
			const token = await User.authenticate({
				email: 'olga@locker.ai',
				password: '123',
			});
			const { id } = jwt.verify(token, process.env.JWT);
			expect(seed.users.olga.id).to.equal(id);
		});
	});

	describe('token exchange', () => {
		describe('with a valid token', () => {
			it('can be exchange for the user', async () => {
				const token = jwt.sign({ id: seed.users.fernando.id }, process.env.JWT);
				const fernando = await User.findByToken(token);
				expect(fernando.email).to.equal('fernando@locker.ai');
			});

			describe('with no user', () => {
				it('will throw an error', async () => {
					const token = jwt.sign({ id: seed.users.fernando.id }, process.env.JWT);
					await seed.users.fernando.destroy();
					try {
						const fernando = await User.findByToken(token);
						throw 'noooooooo';
					} catch (ex) {
						expect(ex.status).to.equal(401);
					}
				});
			});
		});

		describe('with a invalid token', () => {
			it('can not be exchanged for the user', async () => {
				const token = jwt.sign({ id: seed.users.fernando.id }, process.env.JWT + '!');
				try {
					const fernando = await User.findByToken(token);
					throw 'noooooooo';
				} catch (ex) {
					expect(ex.status).to.equal(401);
				}
			});
		});
	});
});
