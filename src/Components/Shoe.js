import React, { useRef } from 'react';
import { useGLTF, Decal, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Shoe = ({ ...props }) => {
	const group = useRef();
	const { nodes, materials } = useGLTF('../../static/shoe.gltf');

	const bodyTexture = useTexture(props.bodyImage === '' ? '../../static/default-image.png' : props.bodyImage);
	bodyTexture.needsUpdate = true;

	if (bodyTexture) {
		bodyTexture.wrapS = bodyTexture.wrapT = THREE.RepeatWrapping;
		bodyTexture.repeat.set(props.repeatAmount, props.repeatAmount);
		bodyTexture.anisotropy = 16;
	}

	useFrame((state) => {
		const time = state.clock.getElapsedTime();
		group.current.rotation.z = Math.sin(time / 2) / 6;
		group.current.rotation.x = Math.sin(time / 2) / 6;
		group.current.rotation.y = Math.sin(time / 4) / 6;
		group.current.position.y = Math.sin(time / 4) / 6;
	});

	return (
		<group ref={group} {...props}>
			<group rotation={[-Math.PI, -0.85, -Math.PI]}>
				<mesh geometry={nodes.Plane003.geometry} material={materials.body} material-color={props.colors.body}>
					<Decal position={[0, 0, 1]} scale={[props.scaleX, props.scaleY]} map={bodyTexture} />
				</mesh>
				<mesh geometry={nodes.Plane003_1.geometry} material={materials.sole} material-color={props.colors.sole} />
				<mesh geometry={nodes.Plane003_2.geometry} material={materials.collar} material-color={props.colors.collar} />
				<mesh geometry={nodes.Plane003_3.geometry} material={materials.tag} material-color={props.colors.tag} />
				<mesh geometry={nodes.Plane003_4.geometry} material={materials.tongue} material-color={props.colors.tongue} />
				<mesh geometry={nodes.Plane003_8.geometry} material={materials.toe} material-color={props.colors.toe}>
					<Decal position={[0, 0, 1]} scale={[props.scaleX, props.scaleY]} map={bodyTexture} />
				</mesh>
				<mesh geometry={nodes.Plane003_9.geometry} material={materials.badge} material-color={props.colors.badge} />
				<mesh
					geometry={nodes.Plane003_10.geometry}
					material={materials.tongueStrap}
					material-color={props.colors.tongueStrap}
				/>
				<mesh geometry={nodes.Plane003_11.geometry} material={materials.laces} material-color={props.colors.laces} />
				<mesh
					geometry={nodes.Plane003_12.geometry}
					material={materials.eyelets}
					material-color={props.colors.eyelets}
				/>
			</group>
		</group>
	);
};

useGLTF.preload('/shoe.gltf');

export default Shoe;
