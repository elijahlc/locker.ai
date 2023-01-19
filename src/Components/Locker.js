import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLocker, deleteShoe } from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Locker = () => {
	const { shoes, auth } = useSelector((state) => state);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const { index } = useParams();
	const pageSize = window.innerWidth < 800 ? 1 : 5;
	const pageCount = Math.ceil(shoes.length / pageSize);
	const filtered = shoes.slice(pageSize * index, pageSize * (index * 1 + 1));

	useEffect(() => {
		dispatch(getLocker());
	}, []);

	useEffect(() => {
		document.title = `Locker.ai: ${auth.firstName}'s locker`;
	}, [auth]);

	return (
		<div className="Locker">
			{index * 1 !== 0 ? (
				<button className="Locker-page button button-small left">
					<i className="fa-solid fa-caret-left" onClick={() => navigate(`/locker/${index * 1 - 1}`)}></i>
				</button>
			) : null}

			{filtered.map((shoe) => {
				return (
					<div key={shoe.id} className="Locker-card">
						<span className="Locker-shoe-name">"{shoe.name}"</span>

						<div className="Locker-shoe-art-details" onClick={() => navigate(`/locker/shoe/${shoe.id}`)}>
							<img src={shoe.image} className="Locker-shoe-image" />

							<div className="Locker-shoe-palette">
								<div className="Locker-shoe-color" style={{ backgroundColor: `${shoe.laceColor}` }}></div>
								<div className="Locker-shoe-color" style={{ backgroundColor: `${shoe.tongueColor}` }}></div>
								<div className="Locker-shoe-color" style={{ backgroundColor: `${shoe.soleColor}` }}></div>
								<div className="Locker-shoe-color" style={{ backgroundColor: `${shoe.collarColor}` }}></div>
								<div className="Locker-shoe-color" style={{ backgroundColor: `${shoe.tagColor}` }}></div>
								<div className="Locker-shoe-color" style={{ backgroundColor: `${shoe.badgeColor}` }}></div>
								<div className="Locker-shoe-color" style={{ backgroundColor: `${shoe.tongueStrapColor}` }}></div>
								<div className="Locker-shoe-color" style={{ backgroundColor: `${shoe.eyeletsColor}` }}></div>
							</div>
						</div>
						<i
							className="fa-solid fa-trash-can"
							onClick={() => {
								dispatch(deleteShoe(shoe)),
									enqueueSnackbar('Shoe deleted!', {
										variant: 'info',
									});
							}}
						></i>
					</div>
				);
			})}
			{index * 1 < pageCount - 1 ? (
				<button className="Locker-page button button-small right">
					<i className="fa-solid fa-caret-right" onClick={() => navigate(`/locker/${index * 1 + 1}`)}></i>
				</button>
			) : null}
		</div>
	);
};

export default Locker;
