import axios from 'axios';
const auth = (state = {}, action) => {
	if (action.type === 'SET_AUTH') {
		return action.auth;
	}
	return state;
};

export const logout = (navigate) => {
	window.localStorage.removeItem('token');
	navigate('/');
	return { type: 'SET_AUTH', auth: {} };
};

export const loginWithToken = () => {
	return async (dispatch) => {
		const token = window.localStorage.getItem('token');
		if (token) {
			const response = await axios.get('/api/auth', {
				headers: {
					authorization: token,
				},
			});
			dispatch({ type: 'SET_AUTH', auth: response.data });
		}
	};
};

export const updateAuth = (auth) => {
	return async (dispatch) => {
		const token = window.localStorage.getItem('token');
		const response = await axios.put('/api/auth', auth, {
			headers: {
				authorization: token,
			},
		});
		dispatch({ type: 'SET_AUTH', auth: response.data });
	};
};

export const attemptLogin = (credentials, navigate) => {
	return async (dispatch) => {
		try {
			const response = await axios.post('/api/auth', credentials);
			window.localStorage.setItem('token', response.data);
			dispatch(loginWithToken());
			navigate('/create');
		} catch (err) {
			return err.response.data.error;
		}
	};
};

export const register = (credentials, navigate) => {
	return async (dispatch) => {
		const response = await axios.post('/api/auth/register', credentials);
		window.localStorage.setItem('token', response.data);
		dispatch(loginWithToken());
		navigate('/create');
	};
};

export default auth;
