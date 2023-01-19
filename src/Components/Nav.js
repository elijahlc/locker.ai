import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../store';

const Nav = () => {
	const { auth } = useSelector((state) => state);
	const [menuOpen, setMenuOpen] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const toggleMenuOpen = () => {
		setMenuOpen(!menuOpen);
	};

	const handleMenuClick = (e) => {
		if (e.target.name === 'logout') {
			dispatch(logout(navigate));
		} else {
			navigate(`/${e.target.name}`);
		}

		toggleMenuOpen();
	};

	return (
		<nav className="Nav">
			<Link to="/">Locker.ai</Link>

			{auth.id ? (
				<div className="Nav-right">
					<Link to="/create">
						<i className="fa-solid fa-plus"></i>
					</Link>
					<img src={auth.avatar ? auth.avatar : '../../static/user-solid.svg'} onClick={toggleMenuOpen} />
				</div>
			) : (
				<Link to="/login">Login</Link>
			)}

			{menuOpen ? (
				<div className="Nav-menu">
					<Link to="/locker/0" name="locker/0" onClick={handleMenuClick}>
						{auth.firstName}'s locker
					</Link>
					<Link to="/profile" name="profile" onClick={handleMenuClick}>
						Profile
					</Link>
					<button className="button button-small" onClick={handleMenuClick} name="logout">
						Logout
					</button>
				</div>
			) : null}
		</nav>
	);
};

export default Nav;
