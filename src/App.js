import { React, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import BoxModel from "./Components/BoxModel";
import FallingBox from "./Components/FallingBox";
import Screen from "./Components/Screen";
import { Physics } from "@react-three/cannon";
import { nanoid } from "nanoid";

function App() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [fallingStack, setFallingStack] = useState([]);
    const [stack, setStack] = useState([
        { x: 0, y: 0, z: 0, width: 3, depth: 3 },
    ]);
    const [gameStarted, setGameStarted] = useState(false);
    const [BGColor, setBGColor] = useState("#000");
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

    const handleButton = (e) => {
        if (e.key === " " || e.code === "Space" || e.keyCode === 32) {
            if (!gameStarted) {
                return;
            }
            if (stack.length > 1) {
                cutFallenBox();
            } else {
                generateBox();
            }
        }
    };

    useEffect(() => {
        let bg = "#000";
        if (stack.length > 3) {
            bg = "#10122b";
        }
        if (stack.length > 10) {
            bg = "#24003b";
        }
        if (stack.length > 20) {
            bg = "#2b0125";
        }
        if (stack.length > 30) {
            bg = "#360113";
        }
        if (stack.length > 40) {
            bg = "#400000";
        }
        if (BGColor !== bg) {
            setBGColor(bg);
        }
        //eslint-disable-next-line
    }, [stack]);

    const cutFallenBox = () => {
        console.log("Checking");
        const prevBox = stack[stack.length - 2];
        const topBox = topBoxPosition;
        console.log(topBoxPosition);

        let fallingBox = {
            id: nanoid(),
            x: 0,
            y: topBox.y,
            z: 0,
            width: 0,
            depth: 0,
        };

        let direction = "";
        let checkSize = "";
        if (stack.length % 2 === 0) {
            direction = "z";
            checkSize = "depth";
            fallingBox.x = topBox.x;
            fallingBox.width = topBox.width;
        } else {
            direction = "x";
            checkSize = "width";
            fallingBox.z = topBox.z;
            fallingBox.depth = topBox.depth;
        }
        const delta = Math.abs(prevBox[direction] - topBox[direction]).toFixed(
            2
        );
        const overlap = prevBox[checkSize] - delta;

        if (overlap <= 0) {
            //Outside boundary, end game
            console.log("No Overlap");
            let stackUpdate = stack;
            stackUpdate.pop();
            setStack(stackUpdate);
            setGameStarted(false);
            fallingBox[direction] = topBox[direction];
            fallingBox[checkSize] = topBox[checkSize];
        } else {
            //Touching box, cut it and generate next box of same size and position
            //Set fixed position of current box
            console.log("Overlap");
            topBox[checkSize] = overlap;
            fallingBox[checkSize] = delta;
            fallingBox[direction] = topBox[direction];
            if (prevBox[direction] - topBox[direction] > 0) {
                fallingBox[direction] -= overlap / 2;
                topBox[direction] += delta / 2;
            } else {
                fallingBox[direction] += overlap / 2;
                topBox[direction] -= delta / 2;
            }
            let stackUpdate = stack;
            stackUpdate[stackUpdate.length - 1] = topBox;
            setStack(stackUpdate);
            generateBox();
        }
        setFallingStack((prev) => {
            return [...prev, fallingBox];
        });
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
            if (index > 0 && index === stack.length - 1 && gameStarted) {
                animate = true;
                if (index % 2 === 0) {
                    direction = "right";
                } else {
                    direction = "left";
                }
            }
            let key = nanoid();
            if (index === stack.length - 1) {
                key = index;
            }
            return (
                <BoxModel
                    key={key}
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

    const startNewGame = async () => {
        if (!gameStarted) {
            setFallingStack([]);
            setStack([{ x: 0, y: 0, z: 0, width: 3, depth: 3 }]);
            setTopBoxPosition({
                x: 0,
                y: 0,
                z: 0,
                width: 3,
                depth: 3,
            });
            setGameStarted(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            generateBox();
        }
    };

    const renderFallingBoxes = () => {
        return fallingStack.map((box) => {
            return <FallingBox key={box.id} box={box} removeBox={removeBox} />;
        });
    };

    const removeBox = (id) => {
        let stackUpdate = fallingStack;
        stackUpdate = stackUpdate.filter((box) => box.id !== id);
        setFallingStack(stackUpdate);
    };

    const crossedLimit = () => {
        setGameStarted(false);
    };

    const getCameraPosition = () => {
        if (windowSize.width < 700) {
            if (stack.length < 3) {
                return [0, 3, 4];
            }
            console.log("Cam pos height:", stack.length);
            return [0, stack.length / 2 + 2, 4];
        }
        if (stack.length < 3) {
            return [0, 4, 4];
        }
        console.log("Cam pos height:", stack.length + 2);
        return [0, stack.length + 2, 4];
    };

    const getGameScale = () => {
        if (windowSize.width < 700) {
            return 0.5;
        }
        return 1;
    };

    return (
        <>
            <div
                className="app-wrapper"
                style={{ backgroundColor: BGColor }}
                onKeyUp={(e) => handleButton(e)}
            >
                {!gameStarted && (
                    <Screen score={stack.length - 1} startGame={startNewGame} />
                )}
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
                    <Physics>
                        <group
                            scale={getGameScale()}
                            rotation={[0, Math.PI / 4, 0]}
                        >
                            {renderBoxes()}
                            {renderFallingBoxes()}
                        </group>
                    </Physics>
                </Canvas>
            </div>
        </>
    );
}

export default App;
