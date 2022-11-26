import { React, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";

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
  const state = useRef({
    position: getPosition(),
  });

  const [myBox, api] = useBox(() => ({
    mass: 2,
    position: getPosition(),
    args: [xSize, 1, zSize],
    type: "Static",
  }));

  useEffect(() => {
    api.position.subscribe((p) => (state.current.position = p));
  }, [api]);

  useFrame(() => {
    if (gameStarted) {
      if (crossed()) {
        crossedLimit();
      } else {
        if (animate) {
          if (direction === "left") {
            myBox.current.position.z = myBox.current.position.z + difficulty();
            api.position.set(
              state.current.position[0],
              state.current.position[1],
              state.current.position[2] + difficulty()
            );
          } else if (direction === "right") {
            myBox.current.position.x = myBox.current.position.x - difficulty();
            api.position.set(
              state.current.position[0] - difficulty(),
              state.current.position[1],
              state.current.position[2]
            );
          }
          updatePosition({
            x: state.current.position[0],
            y: state.current.position[1],
            z: state.current.position[2],
            width: myBox.current.geometry.parameters.width,
            depth: myBox.current.geometry.parameters.depth,
          });
        } else {
          api.position.set(xPos, height, zPos);
          myBox.current.position.x = xPos;
          myBox.current.position.y = height;
          myBox.current.position.z = zPos;
        }
      }
    }
  });

  const difficulty = () => {
    let dif = 0.01 * (height / 1.5);
    if (dif > 1.0) {
      dif = 0.01 * (height / 1.35);
    }
    if (dif > 2.0) {
      dif = 0.01 * (height / 1.2);
    }
    if (dif > 2.5) {
      dif = 0.01 * (height / 0.9);
    }
    if (dif > 3.0) {
      dif = 0.01 * (height / 0.75);
    }
    return dif + 0.12;
  };

  const crossed = () => {
    if (direction === "left") {
      if (state.current.position[2] > 15) {
        return true;
      }
    } else if (direction === "right") {
      if (state.current.position[0] < -15) {
        return true;
      }
    }
    return false;
  };

  function getPosition() {
    if (height === 0) {
      return [0, 0, 0];
    }
    if (!animate) {
      return [xPos, height, zPos];
    } else {
      if (direction === "left") {
        return [xPos, height, -15];
      } else if (direction === "right") {
        return [15, height, zPos];
      } else {
        return [xPos, height, zPos];
      }
    }
  }

  return (
    <mesh ref={myBox} position={getPosition()}>
      <boxGeometry args={[xSize, 1, zSize]} />
      <meshStandardMaterial color={`hsl(${200 + height * 4},100%,50%)`} />
    </mesh>
  );
}
