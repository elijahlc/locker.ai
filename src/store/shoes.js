import axios from 'axios';

const shoes = (state = [], action) => {
	if (action.type === 'SET_LOCKER') {
		return action.locker;
	}

	if (action.type === 'ADD_TO_LOCKER') {
		return [...state, action.shoe];
	}

	if (action.type === 'DELETE_SHOE') {
		return state.filter((shoe) => shoe.id !== action.shoe.id);
	}

	if(action.type === 'UPDATE_SHOE') {
		return state.map( shoe => shoe.id === action.shoe.id ? action.shoe : shoe);
	}

	return state;
};

export const getLocker = () => {
	return async (dispatch) => {
		const token = window.localStorage.getItem('token');

		if (token) {
			const response = await axios.get('/api/shoes', {
				headers: { authorization: token },
			});

			dispatch({ type: 'SET_LOCKER', locker: response.data });
		}
	};
};

export const addToLocker = (shoe) => {
	return async (dispatch) => {
		const token = window.localStorage.getItem('token');

		if (token) {
			const response = await axios.post('/api/shoes', shoe, {
				headers: { authorization: token },
			});

			dispatch({ type: 'ADD_TO_LOCKER', shoe: response.data });
		}
	};
};

export const deleteShoe = (shoe) => {
	return async (dispatch) => {
		const token = window.localStorage.getItem('token');

		if (token) {
			await axios.delete(`/api/shoes/${shoe.id}`, {
				headers: { authorization: token },
			});

			dispatch({ type: 'DELETE_SHOE', shoe });
		}
	};
};

export const updateShoe = (shoe) => {
	return async (dispatch) => {
		const token = window.localStorage.getItem('token');

		if(token) {
			const response = await axios.put (`/api/shoes/${shoe.id}`, shoe, {
				headers: { authorization: token},
			});

			dispatch( {type: 'UPDATE_SHOE', shoe: response.data });
		}
 	};
};

export default shoes;
