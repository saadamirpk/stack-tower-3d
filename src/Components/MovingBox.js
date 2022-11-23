import { React, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";

export default function MovingBox({ width, depth, xPos, zPos, height }) {
  const state = useRef({
    position: [0, 0, 0],
  });

  const [myBox, api] = useBox(() => ({
    mass: 10,
    position: getPosition(),
    args: [width, 1, depth],
    type: "Static",
  }));

  useEffect(() => {
    api.position.subscribe((p) => (state.current.position = p));
  }, [api]);

  useFrame(() => {
    myBox.current.position.x += 0.01;
    api.position.set(
      (state.current.position[0] += 0.01),
      state.current.position[1],
      state.current.position[2]
    );
  });

  function getPosition() {
    return [xPos, height, zPos];
  }

  return (
    <mesh ref={myBox} position={getPosition()}>
      <boxGeometry args={[width, 1, depth]} />
      <meshStandardMaterial color={`hsl(${180 + height * 4},100%,50%)`} />
    </mesh>
  );
}
