import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAuth } from '../store';
import video from '../../static/video.mp4';
import image from '../../static/ShoeVideoStill.png';
import { useSnackbar } from 'notistack';

const Profile = () => {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { auth } = useSelector((state) => state);

	const [details, setDetails] = useState({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		avatar: '',
	});

	const [editing, setEditing] = useState(false);

	const [file, setFile] = useState(null);

	const [error, setError] = useState({});

	const dateOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	};

	useEffect(() => {
		document.title = 'Locker.ai: Profile';

		setDetails({
			...details,
			email: auth.email,
			firstName: auth.firstName,
			lastName: auth.lastName,
			avatar: auth.avatar,
		});
	}, [auth]);

	useEffect(() => {
		if (file) {
			file.addEventListener('change', (e) => {
				const fileData = e.target.files[0];

				const reader = new FileReader();

				reader.readAsDataURL(fileData);

				reader.addEventListener('load', () => {
					setDetails({ ...details, avatar: reader.result });
				});
			});
		}
	}, [file]);

	const onChange = (ev) => {
		setDetails({ ...details, [ev.target.name]: ev.target.value });
	};

	const save = async (e) => {
		e.preventDefault();

		try {
			await dispatch(updateAuth({ ...details, id: auth.id }));

			setDetails({ ...details, password: '' });

			setEditing(false);

			enqueueSnackbar('Profile saved!', {
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'center',
				},
				variant: 'success',
			});
		} catch (err) {
			setError({ errors: err.response.data });
		}
	};

	let errorMessages = [];

	if (error.errors) {
		errorMessages = error.errors.map((err) => err.message);
		console.log(errorMessages);
	}

	const cancel = () => {
		setEditing(false);
		setDetails({
			...details,
			email: auth.email,
			firstName: auth.firstName,
			lastName: auth.lastName,
			avatar: auth.avatar,
		});
	};

	return (
		<div className="Profile Home-overlay">
			{window.innerWidth < 800 ? (
				<img className="background-image" src={image} />
			) : (
				<video src={video} autoPlay loop muted />
			)}

			{editing ? (
				<form className="Profile-container" onSubmit={save}>
					<section className="Profile-half">
						<label htmlFor="avatar">
							<img src={details.avatar ? details.avatar : '../../static/user-solid.svg'} />
							<span className="avatar-overlay">Change profile picture</span>

							<input
								type="file"
								id="avatar"
								name="avatar"
								accept="image/*"
								ref={(x) => setFile(x)}
								style={{ display: 'none' }}
							/>
						</label>
					</section>

					<section className="Profile-half">
						<div>
							<span className="Register-horizontal">
								<label htmlFor="firstName">First name</label>
								<input type="text" id="firstName" value={details.firstName} name="firstName" onChange={onChange} />
							</span>
							<span className="Register-horizontal">
								<label htmlFor="lastName">Last name</label>
								<input type="text" id="lastName" value={details.lastName} name="lastName" onChange={onChange} />
							</span>
						</div>

						<label htmlFor="email">Email</label>
						<input type="text" id="email" value={details.email} name="email" onChange={onChange} />

						<label htmlFor="password" className="required">
							Password *
						</label>
						<input
							id="password"
							type="password"
							name="password"
							value={details.password}
							onChange={onChange}
							placeholder="Type old password to confirm or new password to change"
							required
						/>

						{errorMessages.length ? (
							<div className="Profile-error">
								<span>Could not update your profile! Please address these errors:</span>

								<ul>
									{errorMessages.map((msg) => {
										return <li key={msg}>{msg}</li>;
									})}
								</ul>
							</div>
						) : null}

						<div>
							<button onClick={cancel} className="button button-large">
								Cancel
							</button>
							<button disabled={details.password === '' ? true : false} className="button button-large">
								Save
							</button>
						</div>
					</section>
				</form>
			) : (
				<div className="Profile-container">
					<div className="Profile-half">
						<img src={details.avatar ? details.avatar : '../../static/user-solid.svg'} />
					</div>

					<div className="Profile-half">
						<h1 className="Profile-name">
							👋 Hi, {auth.firstName} {auth.lastName}!
						</h1>
						<div className="Profile-details">✉️ {auth.email}</div>
						<div className="Profile-details">
							🗓 Member since: {new Date(auth.createdAt).toLocaleDateString('en-US', dateOptions)}
						</div>
						<div className="button-link" onClick={() => setEditing(true)}>
							Edit profile
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
