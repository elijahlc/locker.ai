import React, { useEffect } from 'react';
import Nav from './Nav';
import Home from './Home';
import Locker from './Locker';
import Profile from './Profile';
import { useDispatch } from 'react-redux';
import { loginWithToken } from '../store';
import { Routes, Route } from 'react-router-dom';
import CreateShoe from './CreateShoe';
import NotFound from './NotFound';
import ShoeDetails from './ShoeDetails';

const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loginWithToken());

		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}, []);

	return (
		<div className="App">
			<Nav />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Home />} />
				<Route path="/register" element={<Home />} />
				<Route path="/create" element={<CreateShoe />} />
				<Route path="/locker/:index" element={<Locker />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/locker/shoe/:id" element={<ShoeDetails />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
};

export default App;
