import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ContactShadows } from '@react-three/drei';
import Shoe from './Shoe';
import axios from 'axios';
import { addToLocker } from '../store/shoes';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateShoe = () => {
	const { auth } = useSelector((state) => state);

	const [prompt, setPrompt] = useState('');
	const [result, setResult] = useState('');
	const [image, setImage] = useState('');
	const [loading, setLoading] = useState(false);
	const [body, setBody] = useState('#FFFFFF');
	const [laces, setLaces] = useState('#FFFFFF');
	const [tongue, setTongue] = useState('#FFFFFF');
	const [sole, setSole] = useState('#FFFFFF');
	const [collar, setCollar] = useState('#FFFFFF');
	const [tag, setTag] = useState('#FFFFFF');
	const [badge, setBadge] = useState('#FFFFFF');
	const [tongueStrap, setTongueStrap] = useState('#FFFFFF');
	const [eyelets, setEyelets] = useState('#FFFFFF');
	const [repeatAmount, setRepeatAmount] = useState(1);
	const [scaleX, setScaleX] = useState(1);
	const [scaleY, setScaleY] = useState(4);

	const navigate = useNavigate();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const dispatch = useDispatch();

	useEffect(() => {
		document.title = 'Locker.ai: Create a Shoe';

		const savedShoe = JSON.parse(window.localStorage.getItem('shoe'));

		if (savedShoe) {
			window.localStorage.removeItem('shoe');

			setPrompt(savedShoe.name);
			setLaces(savedShoe.laceColor);
			setTongue(savedShoe.tongueColor);
			setSole(savedShoe.soleColor);
			setCollar(savedShoe.collarColor);
			setTag(savedShoe.tagColor);
			setBadge(savedShoe.badgeColor);
			setTongueStrap(savedShoe.tongueStrapColor);
			setEyelets(savedShoe.eyeletsColor);
			setScaleX(savedShoe.scaleX);
			setScaleY(savedShoe.scaleY);
			setRepeatAmount(savedShoe.repeatAmount);
			setImage(`data:image/png;base64,${savedShoe.image}`);
		}
	}, []);

	const getImage = async (e) => {
		e.preventDefault();
		setLoading(true);
		setImage('');
		const imageResult = await axios.post('/api/image', { prompt });
		setImage(`data:image/png;base64,${imageResult.data}`);
		setLoading(false);
	};

	const displayImage = () => {
		if (!image && !loading) {
			return <div className="CreateShoe-default-image"></div>;
		} else if (!image && loading) {
			return <Skeleton variant="rectangular" />;
		} else {
			return <img src={image} />;
		}
	};

	const addToShoe = () => {
		setResult(image);
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

	const _addToLocker = () => {
		const shoe = {
			userId: auth.id,
			name: prompt,
			image: image.replace('data:image/png;base64,', ''),
			laceColor: laces,
			tongueColor: tongue,
			soleColor: sole,
			collarColor: collar,
			tagColor: tag,
			badgeColor: badge,
			tongueStrapColor: tongueStrap,
			eyeletsColor: eyelets,
			scaleX: scaleX,
			scaleY: scaleY,
			repeatAmount: repeatAmount,
		};

		if (auth.id) {
			if (image.startsWith('data:image/png;base64,')) {
				dispatch(addToLocker(shoe));

				enqueueSnackbar('Shoe added to locker!', {
					variant: 'success',
					action,
				});
			} else {
				enqueueSnackbar('Please add an image to your shoe', {
					variant: 'error',
				});
			}
		} else {
			window.localStorage.setItem('shoe', JSON.stringify(shoe));
			navigate('/login');
		}
	};

	const reset = () => {
		setBody('#FFFFFF');
		setLaces('#FFFFFF');
		setTongue('#FFFFFF');
		setSole('#FFFFFF');
		setCollar('#FFFFFF');
		setTag('#FFFFFF');
		setBadge('#FFFFFF');
		setTongueStrap('#FFFFFF');
		setEyelets('#FFFFFF');
		setPrompt('');
		setResult('');
		setImage('');
		setRepeatAmount(1);
		setScaleX(1);
		setScaleY(4);
	};

	return (
		<div className="CreateShoe">
			<div className="CreateShoe-image-controls">
				<h1>What do you want to see?</h1>

				<input
					type="text"
					placeholder="Enter a prompt"
					onChange={(e) => setPrompt(e.target.value)}
					value={prompt}
				></input>

				<button className="button button-small" onClick={getImage}>
					Generate
				</button>

				{displayImage()}

				<button className="button button-small" onClick={addToShoe}>
					Add to Shoe
				</button>

				<div>Use the below sliders to control how your image fits on your shoe:</div>

				<input
					type="range"
					min="1"
					max="10"
					onChange={(ev) => {
						setRepeatAmount(ev.target.value);
					}}
					id="repeatAmount"
					value={repeatAmount}
					disabled={result === '' ? true : false}
				></input>
				<label htmlFor="repeatAmount" name="repeatAmount">
					Repeat amount
				</label>

				<input
					type="range"
					min="1"
					max="10"
					onChange={(ev) => {
						setScaleX(ev.target.value);
					}}
					id="scaleX"
					value={scaleX}
					disabled={result === '' ? true : false}
				></input>
				<label htmlFor="scaleX" name="scaleX">
					Scale (X axis)
				</label>

				<input
					type="range"
					min="1"
					max="10"
					onChange={(ev) => {
						setScaleY(ev.target.value);
					}}
					id="scaleY"
					value={scaleY}
					disabled={result === '' ? true : false}
				></input>
				<label htmlFor="scaleY" name="scaleY">
					Scale (Y axis)
				</label>
			</div>

			<div className="CreateShoe-canvas-controls">
				<div className="CreateShoe-canvas">
					<Canvas>
						<Shoe
							colors={{
								body: body,
								laces: laces,
								tongue: tongue,
								sole: sole,
								collar: collar,
								tag: tag,
								badge: badge,
								tongueStrap: tongueStrap,
								eyelets: eyelets,
							}}
							bodyImage={result}
							repeatAmount={repeatAmount}
							scaleX={scaleX}
							scaleY={scaleY}
						/>
						<ContactShadows position={[0, -0.8, 0]} opacity={0.4} blur={1} />
						<ambientLight />
						<directionalLight />
						<OrbitControls maxPolarAngle={Math.PI / 2} maxDistance={4} minDistance={2} />
					</Canvas>
				</div>

				<div className="CreateShoe-colors-actions">
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
					<div className="CreateShoe-actions">
						<button className="button button-small" onClick={_addToLocker}>
							<span className="button-tooltip">Add to Locker</span>
						</button>

						<button className="button button-small" onClick={reset}>
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateShoe;
