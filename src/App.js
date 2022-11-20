import { React, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import BoxModel from "./Components/BoxModel";

function App() {
  const [stackHeight, setStackHeight] = useState(1);
  const [stack, setStack] = useState([{ height: 0, x: 3, z: 3 }]);
  const [gameStarted, setGameStarted] = useState(false);
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    window.addEventListener("click", () => handleClick());
    return () => window.removeEventListener("click", () => handleClick());
    // eslint-disable-next-line
  }, [gameStarted]);

  const handleClick = (e) => {
    if (!gameStarted) {
      return;
    }
    generateBox();
  };

  const generateBox = () => {
    setStack((prev) => {
      return [
        ...prev,
        {
          height: prev[prev.length - 1].height + 1,
          x: 3,
          z: 3,
        },
      ];
    });
    setStackHeight((prev) => prev + 1);
  };

  const renderBoxes = () => {
    return stack.map((box, index) => {
      let animate = false;
      let direction = "";
      if (index > 0 && index === stackHeight - 1) {
        animate = true;
        if (index % 2 === 0) {
          direction = "right";
        } else {
          direction = "left";
        }
      }
      return (
        <BoxModel
          key={index}
          xSize={box.x}
          zSize={box.z}
          animate={animate}
          height={box.height}
          direction={direction}
        />
      );
    });
  };

  const getCameraPosition = () => {
    if (stackHeight < 2) {
      return [0, 4, 4];
    }
    return [0, stackHeight + 3, 4];
  };

  return (
    <>
      <button onClick={() => setGameStarted(true)}>Start Game</button>
      <button onClick={() => generateBox()}>new Box</button>
      <Canvas>
        <OrthographicCamera
          makeDefault
          left={-width / 2}
          right={width / 2}
          top={height / 2}
          bottom={-height / 2}
          near={-5}
          far={200}
          zoom={100}
          position={getCameraPosition()}
          rotation={[-0.5, 0, 0]}
          lookAt={[0, 0, 0]}
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 0]} intensity={0.6} />
        <group rotation={[0, Math.PI / 4, 0]}>{renderBoxes()}</group>
      </Canvas>
    </>
  );
}

export default App;
