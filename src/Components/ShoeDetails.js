import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ContactShadows } from '@react-three/drei';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Shoe from './Shoe';
import { deleteShoe, updateShoe } from '../store';
import NotFound from './NotFound';

import { useSnackbar } from 'notistack';

const ShoeDetails = () => {
	const { id } = useParams();
	const { shoes } = useSelector((state) => state);
	const shoe = shoes.find((shoe) => shoe.id === id);
	const dispatch = useDispatch();
	const { auth } = useSelector((state) => state);
	const navigate = useNavigate();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const [prompt, setPrompt] = useState('');
	const [laces, setLaces] = useState('#FFFFFF');
	const [tongue, setTongue] = useState('#FFFFFF');
	const [sole, setSole] = useState('#FFFFFF');
	const [collar, setCollar] = useState('#FFFFFF');
	const [tag, setTag] = useState('#FFFFFF');
	const [badge, setBadge] = useState('#FFFFFF');
	const [tongueStrap, setTongueStrap] = useState('#FFFFFF');
	const [eyelets, setEyelets] = useState('#FFFFFF');

	if (!shoe) {
		return <NotFound />;
	}

	useEffect(() => {
		setLaces(shoe.laceColor);
		setTongue(shoe.tongueColor);
		setSole(shoe.soleColor);
		setCollar(shoe.collarColor);
		setTag(shoe.tagColor);
		setBadge(shoe.badgeColor);
		setTongueStrap(shoe.tongueStrapColor);
		setEyelets(shoe.eyeletsColor);
	}, []);

	const _reset = () => {
		setLaces(shoe.laceColor);
		setTongue(shoe.tongueColor);
		setSole(shoe.soleColor);
		setCollar(shoe.collarColor);
		setTag(shoe.tagColor);
		setBadge(shoe.badgeColor);
		setTongueStrap(shoe.tongueStrapColor);
		setEyelets(shoe.eyeletsColor);
	};

	const action = ({ id }) => (
		<button
			className="button button-small"
			onClick={() => {
				closeSnackbar(id);
				navigate('/locker/0');
			}}
		>
			Go to Locker
		</button>
	);

	const _updateShoe = () => {
		const updatedShoe = {
			...shoe,
			laceColor: laces,
			tongueColor: tongue,
			soleColor: sole,
			collarColor: collar,
			tagColor: tag,
			badgeColor: badge,
			tongueStrapColor: tongueStrap,
			eyeletsColor: eyelets,
		};

		dispatch(updateShoe(updatedShoe));

		enqueueSnackbar('Shoe saved!', {
			variant: 'success',
			action,
		});
	};

	const _deleteShoe = () => {
		dispatch(deleteShoe(shoe));
		navigate('/locker/0');
		enqueueSnackbar('Shoe deleted!', {
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'center',
			},
			variant: 'info',
		});
	};

	return (
		<div className="ShoeDetails">
			<h1>
				{auth.firstName}'s design: <span>{shoe.name}</span>
			</h1>

			<div className="ShoeDetails-canvas-controls">
				<div className="ShoeDetails-canvas">
					<Canvas>
						<ambientLight />
						<directionalLight />
						<ContactShadows position={[0, -0.8, 0]} opacity={0.4} blur={1} />
						<Shoe
							colors={{
								laces: laces,
								tongue: tongue,
								sole: sole,
								collar: collar,
								tag: tag,
								badge: badge,
								tongueStrap: tongueStrap,
								eyelets: eyelets,
							}}
							bodyImage={shoe.image}
							repeatAmount={shoe.repeatAmount}
							scaleX={shoe.scaleX}
							scaleY={shoe.scaleY}
						/>
						<OrbitControls maxPolarAngle={Math.PI / 2} maxDistance={4} minDistance={2} />
					</Canvas>
				</div>
			</div>
			<div className="ShoeDetails-colors-actions">
				<div className="CreateShoe-color-controls">
					<form>
						<div className="CreateShoe-color">
							<input value={laces} name="laces" type="color" onChange={(ev) => setLaces(ev.target.value)}></input>
							<label htmlFor="laces">Laces</label>
						</div>
						<div className="CreateShoe-color">
							<input value={tongue} name="tongue" type="color" onChange={(ev) => setTongue(ev.target.value)}></input>
							<label htmlFor="tongue">Tongue</label>
						</div>
						<div className="CreateShoe-color">
							<input value={sole} name="sole" type="color" onChange={(ev) => setSole(ev.target.value)}></input>
							<label htmlFor="sole">Sole</label>
						</div>
						<div className="CreateShoe-color">
							<input value={collar} name="collar" type="color" onChange={(ev) => setCollar(ev.target.value)}></input>
							<label htmlFor="collar">Collar</label>
						</div>
						<div className="CreateShoe-color">
							<input value={tag} name="tag" type="color" onChange={(ev) => setTag(ev.target.value)}></input>
							<label htmlFor="tag">Tag</label>
						</div>
						<div className="CreateShoe-color">
							<input value={badge} name="badge" type="color" onChange={(ev) => setBadge(ev.target.value)}></input>
							<label htmlFor="badge">Badge</label>
						</div>
						<div className="CreateShoe-color">
							<input
								value={tongueStrap}
								name="tongueStrap"
								type="color"
								onChange={(ev) => setTongueStrap(ev.target.value)}
							></input>
							<label htmlFor="tongueStrap">Tongue Strap</label>
						</div>
						<div className="CreateShoe-color">
							<input
								value={eyelets}
								name="eyelets"
								type="color"
								onChange={(ev) => {
									setEyelets(ev.target.value);
								}}
							></input>
							<label htmlFor="eyelets">Eyelets</label>
						</div>
					</form>
				</div>
				<div className="ShoeDetails-actions">
					<button className="button button-small" onClick={_updateShoe}>
						Save Changes
					</button>

					<button className="button button-small" onClick={_reset}>
						Discard Changes
					</button>

					<button className="button button-small" onClick={() => dispatch(_deleteShoe(shoe))}>
						Delete Shoe
					</button>

					<button className="button button-small" onClick={() => navigate('/locker/0')}>
						Return to Locker
					</button>
				</div>
			</div>
		</div>
	);
};

export default ShoeDetails;
