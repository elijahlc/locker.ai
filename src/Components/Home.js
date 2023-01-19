import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import video from '../../static/video.mp4';
import image from '../../static/ShoeVideoStill.png';
import Login from './Login';
import Register from './Register';

const Home = () => {
	const { auth } = useSelector((state) => state);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const handleClickMain = () => {
		if (auth.id) {
			navigate('/create');
		} else {
			navigate('/register');
		}
	};

	return (
		<div className="Home">
			<div className="Home-overlay">
				{window.innerWidth < 800 ? (
					<img className="background-image" src={image} />
				) : (
					<video src={video} autoPlay loop muted />
				)}

				{pathname === '/login' ? (
					<Login />
				) : pathname === '/register' ? (
					<Register />
				) : (
					<div className="Home-content">
						<h1>Design your own 3D shoe using AI</h1>

						<button className="button-large button" style={{ border: '2px white solid' }} onClick={handleClickMain}>
							{auth.id ? 'Create' : 'Get Started'}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
