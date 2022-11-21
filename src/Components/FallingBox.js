import { React, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";

export default function BoxModel({ box, removeBox }) {
  const myBox = useRef(null);
  useFrame(() => {
    if (myBox.current.position.y < 0) {
      removeBox(box.id);
    }
  });

  function getPosition() {
    return [box.x, box.y, box.z];
  }

  return (
    <Physics>
      <mesh ref={myBox} position={getPosition()}>
        <boxGeometry args={[box.width, 1, box.depth]} />
        <meshStandardMaterial color={`hsl(${180 + box.y * 4},100%,50%)`} />
      </mesh>
    </Physics>
  );
}
