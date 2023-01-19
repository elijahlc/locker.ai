import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import video from '../../static/video.mp4';

const NotFound = () => {
	const navigate = useNavigate();

	useEffect(() => {
		document.title = 'Locker.ai: Page Not Found';
	}, []);

	const handleClick = () => {
		navigate('/');
	};

	return (
		<div className="Home-overlay">
			<video src={video} autoPlay loop muted />
			<div className="NotFound">
				<h1>Oops! You seem to be lost.</h1>
				<button className="button button-large" style={{ border: '2px white solid' }} onClick={handleClick}>
					Go home
				</button>
			</div>
		</div>
	);
};

export default NotFound;
