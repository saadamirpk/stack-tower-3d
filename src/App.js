import { React, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import BoxModel from "./Components/BoxModel";

function App() {
  const [stack, setStack] = useState([
    { x: 0, y: 0, z: 0, width: 3, depth: 3 },
  ]);
  const [gameStarted, setGameStarted] = useState(true);
  const [topBoxPosition, setTopBoxPosition] = useState({
    x: 0,
    y: 0,
    z: 0,
    width: 3,
    depth: 3,
  });
  const width = window.innerWidth;
  const height = window.innerHeight;

  const handleClick = (e) => {
    if (!gameStarted) {
      return;
    }
    if (stack.length > 1) {
      cutFallenBox();
    } else {
      generateBox();
    }
  };

  const cutFallenBox = () => {
    const prevBox = stack[stack.length - 2];
    const topBox = topBoxPosition;
    let direction = "";
    let checkSize = "";
    if (stack.length % 2 === 0) {
      direction = "z";
      checkSize = "depth";
    } else {
      direction = "x";
      checkSize = "width";
    }
    const delta = Math.abs(prevBox[direction] - topBox[direction]);
    const overlap = prevBox[checkSize] - delta;
    if (overlap <= 0) {
      //Outside boundary, end game
      let stackUpdate = stack;
      stackUpdate.pop();
      setStack(stackUpdate);
      setGameStarted(false);
    } else {
      //Touching box, cut it and generate next box of same size and position
      //Set fixed position of current box
      //topBoxPosition[checkSize] = Math.abs(delta - prevBox[checkSize]);
      let stackUpdate = stack;
      //Understand and fix this part
      topBoxPosition[checkSize] = overlap / prevBox[checkSize];
      topBoxPosition[direction] -= delta / 2;
      stackUpdate[stackUpdate.length - 1] = topBoxPosition;
      console.log(stackUpdate);
      setStack(stackUpdate);
      generateBox();
    }
  };

  const generateBox = () => {
    setStack((prev) => {
      return [
        ...prev,
        {
          x: prev[prev.length - 1].x,
          y: prev[prev.length - 1].y + 1,
          z: prev[prev.length - 1].z,
          width: prev[prev.length - 1].width,
          depth: prev[prev.length - 1].depth,
        },
      ];
    });
  };

  const renderBoxes = () => {
    return stack.map((box, index) => {
      let animate = false;
      let direction = "";
      if (index > 0 && index === stack.length - 1) {
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
          xSize={box.width}
          zSize={box.depth}
          animate={animate}
          height={box.y}
          xPos={box.x}
          zPos={box.z}
          direction={direction}
          gameStarted={gameStarted}
          crossedLimit={() => crossedLimit()}
          updatePosition={setTopBoxPosition}
        />
      );
    });
  };

  const crossedLimit = () => {
    console.log("MISSED");
    setGameStarted(false);
  };

  const getCameraPosition = () => {
    if (stack.length < 2) {
      return [0, 4, 4];
    }
    return [0, stack.length + 3, 4];
  };

  return (
    <>
      <Canvas onClick={() => handleClick()}>
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
