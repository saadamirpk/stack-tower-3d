import { React, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function BoxModel({ height, animate, direction, xSize, zSize }) {
  const myBox = useRef(null);
  useFrame(() => {
    if (animate) {
      if (direction === "left") {
        myBox.current.position.z += 0.06 + 0.001 * height;
      } else if (direction === "right") {
        myBox.current.position.x -= 0.06 + 0.001 * height;
      }
    }
  });

  function getPosition() {
    if (height === 0) {
      return [0, height, 0];
    } else {
      if (direction === "left") {
        return [0, height, -5];
      } else if (direction === "right") {
        return [5, height, 0];
      }
    }
  }

  return (
    <mesh ref={myBox} position={getPosition()}>
      <boxGeometry args={[xSize, 1, zSize]} />
      <meshStandardMaterial color={`hsl(${180 + height * 4},100%,50%)`} />
    </mesh>
  );
}
