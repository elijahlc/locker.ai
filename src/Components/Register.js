import React, { useState, useEffect } from 'react';
import { register } from '../store';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [file, setFile] = useState(null);

	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
	});

	const [avatar, setAvatar] = useState('');

	const [error, setError] = useState({});

	useEffect(() => {
		if (file) {
			file.addEventListener('change', (e) => {
				const fileData = e.target.files[0];

				const reader = new FileReader();

				reader.readAsDataURL(fileData);

				reader.addEventListener('load', () => {
					setAvatar(reader.result);
				});
			});
		}
	}, [file]);

	const onChange = (ev) => {
		setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
	};

	const registerUser = async (ev) => {
		ev.preventDefault();

		try {
			await dispatch(register({ ...credentials, avatar }, navigate));
			setCredentials({
				email: '',
				password: '',
				firstName: '',
				lastName: '',
			});
			setAvatar('');
			setFile(null);
			setError({});
		} catch (err) {
			setError({ errors: err.response.data });
		}
	};

	let errorMessages = [];

	if (error.errors) {
		errorMessages = error.errors.map((err) => err.message);
		console.log(errorMessages);
	}

	return (
		<div className="Register">
			<h1>Sign up</h1>

			<form onSubmit={registerUser}>
				<div>
					<span className="Register-horizontal">
						<label htmlFor="firstName" className="required">
							First name *
						</label>
						<input type="text" id="firstName" value={credentials.firstName} name="firstName" onChange={onChange} />
					</span>
					<span className="Register-horizontal">
						<label className="required" htmlFor="lastName">
							Last name *
						</label>
						<input type="text" id="lastName" value={credentials.lastName} name="lastName" onChange={onChange} />
					</span>
				</div>

				<label className="required" htmlFor="email">
					Email *
				</label>
				<input type="text" id="email" value={credentials.email} name="email" onChange={onChange} />

				<label htmlFor="password" className="required">
					Password *
				</label>
				<input id="password" type="password" name="password" value={credentials.password} onChange={onChange} />
				<div>
					<span className="Register-avatar">
						<label htmlFor="avatar">Choose a profile picture </label>

						<input type="file" id="avatar" name="avatar" accept="image/*" ref={(x) => setFile(x)} />
					</span>
					{avatar ? <img src={avatar} /> : <div className="Register-avatar"></div>}
				</div>

				{errorMessages.length ? (
					<div className="Register-error">
						<span>Could not register your new user! Please address these errors:</span>

						<ul>
							{errorMessages.map((msg) => {
								return <li key={msg}>{msg}</li>;
							})}
						</ul>
					</div>
				) : null}

				<button className="button button-large" style={{ margin: 'auto', maxWidth: '50%' }}>
					Sign up
				</button>
			</form>

			<div>
				Already have an account? <Link to="/login">Sign in</Link>
			</div>
		</div>
	);
};

export default Register;
