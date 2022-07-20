import React, { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  ContactShadows,
  Environment
} from "@react-three/drei";
import { HexColorPicker } from "react-colorful";

function Shoe({ ...props }) {
  const { state, setState } = props;
  const ref = useRef();
  const { nodes, materials } = useGLTF("/shoe.gltf");
  const [hovered, set] = useState(null);

  // Animate model
  useFrame(state => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = -0.2 - (1 + Math.sin(t / 1.5)) / 20;
    ref.current.rotation.x = Math.cos(t / 4) / 8;
    ref.current.rotation.y = Math.sin(t / 4) / 8;
    ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
  });

  // Cursor showing current color
  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${state.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
        cursor
      )}'), auto`;
      return () =>
        (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
          auto
        )}'), auto`);
    }
  }, [hovered, state.items]);

  return (
    <group
      ref={ref}
      dispose={null}
      onPointerOver={e => {
        e.stopPropagation();
        set(e.object.material.name);
      }}
      onPointerOut={e => {
        e.intersections.length === 0 && set(null);
      }}
      onPointerMissed={() => {
        setState(prevState => ({
          ...prevState,
          current: null
        }));
      }}
      onClick={e => {
        e.stopPropagation();
        setState(prevState => ({
          ...prevState,
          current: e.object.material.name
        }));
      }}
    >
      <mesh
        geometry={nodes.shoe.geometry}
        material={materials.laces}
        material-color={state.items.laces}
      />
      <mesh
        geometry={nodes.shoe_1.geometry}
        material={materials.mesh}
        material-color={state.items.mesh}
      />
      <mesh
        geometry={nodes.shoe_2.geometry}
        material={materials.caps}
        material-color={state.items.caps}
      />
      <mesh
        geometry={nodes.shoe_3.geometry}
        material={materials.inner}
        material-color={state.items.inner}
      />
      <mesh
        geometry={nodes.shoe_4.geometry}
        material={materials.sole}
        material-color={state.items.sole}
      />
      <mesh
        geometry={nodes.shoe_5.geometry}
        material={materials.stripes}
        material-color={state.items.stripes}
      />
      <mesh
        geometry={nodes.shoe_6.geometry}
        material={materials.band}
        material-color={state.items.band}
      />
      <mesh
        geometry={nodes.shoe_7.geometry}
        material={materials.patch}
        material-color={state.items.patch}
      />
    </group>
  );
}

function Picker({ state, setState }) {
  return (
    <div style={{ display: state.current ? "block" : "none" }}>
      <HexColorPicker
        className="picker"
        color={state.items[state.current]}
        onChange={color =>
          setState(prevState => ({
            ...prevState,
            items: {
              ...prevState.items,
              [state.current]: color
            }
          }))
        }
      />
      <h1>{state.current}</h1>
    </div>
  );
}

function App() {
  const [state, setState] = useState({
    current: null,
    items: {
      laces: "#ff0000",
      mesh: "#ffffff",
      caps: "#ffffff",
      inner: "#ffffff",
      sole: "#ffffff",
      stripes: "#ffffff",
      band: "#ffffff",
      patch: "#ffffff"
    }
  });

  return (
    <>
      <Canvas
        concurrent
        pixelRatio={[1, 1.5]}
        camera={{ position: [0, 0, 2.75] }}
      >
        <ambientLight intensity={0.3} />
        <spotLight
          intensity={0.5}
          angle={0.1}
          penumbra={1}
          position={[10, 15, 10]}
          castShadow
        />
        <Suspense fallback={null}>
          <Shoe state={state} setState={setState} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.25}
            scale={10}
            blur={1.5}
            far={0.8}
          />
        </Suspense>
        <OrbitControls
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
      <Picker state={state} setState={setState} />
    </>
  );
}

export default App;
