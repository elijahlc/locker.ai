import React, { useState } from 'react';
import { attemptLogin } from '../store';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	});

	const [error, setError] = useState(null);

	const onChange = (ev) => {
		setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
	};

	const login = async (ev) => {
		ev.preventDefault();
		const response = await dispatch(attemptLogin(credentials, navigate));

		if (response && (response === 'bad credentials' || response === 'user not found')) {
			setError('Incorrect email or password. Please try again.');
		}
	};
	return (
		<div className="Login">
			<h1>Sign in</h1>

			<form onSubmit={login}>
				<label htmlFor="email">Email</label>
				<input id="email" value={credentials.email} name="email" onChange={onChange} />

				<label htmlFor="password">Password</label>
				<input type="password" name="password" value={credentials.password} onChange={onChange} />

				{error ? <div className="Login-error">{error}</div> : null}

				<button className="button button-large" style={{ margin: 'auto', maxWidth: '50%' }}>
					Sign in
				</button>
			</form>

			<div>
				Don't have an account? <Link to="/register">Sign up</Link>
			</div>
		</div>
	);
};

export default Login;
