import { React, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function BoxModel({
  height,
  animate,
  direction,
  xSize,
  zSize,
  xPos,
  zPos,
  crossedLimit,
  updatePosition,
  gameStarted,
}) {
  const myBox = useRef(null);
  useFrame(() => {
    if (gameStarted) {
      if (crossed()) {
        crossedLimit();
      } else {
        if (animate) {
          if (direction === "left") {
            myBox.current.position.z += 0.065 + 0.001 * height;
          } else if (direction === "right") {
            myBox.current.position.x -= 0.065 + 0.001 * height;
          }
          updatePosition({
            x: myBox.current.position.x,
            y: height,
            z: myBox.current.position.z,
            width: myBox.current.geometry.parameters.width,
            depth: myBox.current.geometry.parameters.depth,
          });
        } else {
          myBox.current.position.x = xPos;
          myBox.current.position.z = zPos;
        }
      }
    }
  });

  const crossed = () => {
    if (direction === "left") {
      if (myBox.current.position.z > 15) {
        return true;
      }
    } else if (direction === "right") {
      if (myBox.current.position.x < -15) {
        return true;
      }
    }
    return false;
  };

  function getPosition() {
    if (height === 0) {
      return [0, height, 0];
    } else {
      if (direction === "left") {
        return [xPos, height, -10];
      } else if (direction === "right") {
        return [10, height, zPos];
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
