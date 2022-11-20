import { React,useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";

function BoxModel({positionHeight, animate, direction, base}) {
    const myBox = useRef(null);
    useFrame(() => {
        if(animate){
            if(direction==='left'){
                myBox.current.position.z +=0.03;
            }else if(direction==='right'){
                myBox.current.position.x -=0.03;
            }
        }
    })

    const getPosition = ()=>{
        if(base){
            return [0,positionHeight,0]
        }else{
            return [-0.5,positionHeight,-0.5]
        }
    }

    return (
    <mesh ref={myBox} position={[0,positionHeight,0]}>
        <boxGeometry args={[3,1,3]} />
        <meshStandardMaterial color={`hsl(${180+positionHeight*4},100%,50%)`} />
    </mesh>);
}

function App() {

    const [stackHeight,setStackHeight] = useState(0);
    const [stack,setStack] = useState([]);
    const [gameStarted,setGameStarted] = useState(false);
    const width = window.innerWidth;
    const height = window.innerHeight;

    useEffect(()=>{
        window.addEventListener('click',handleClick);
        return () => window.removeEventListener('click', handleClick);
    },[gameStarted])

    function handleClick (e) {

    }

    const generateBox=()=>{
        setStack((prev)=>[...prev,{height:stackHeight+1,color:"red"}])
        setStackHeight(prev=>prev+1);
    }

    const renderBoxes = ()=>{
        return stack.map((box, index)=>{
            let animate=false;
            let direction='';
            if(index===stackHeight-1){
                animate=true;
                if(index%2===0){
                    direction='right'
                }else{
                    direction='left'
                }
            }
            return <BoxModel animate={animate} direction={direction} positionHeight={box.height} base={false}/>
        })
    }

    const getCameraPosition = ()=>{
        if(stackHeight<2){
            return [0,4,4];
        }
        return [0,stackHeight+3,4];
    }

  return (
   <>
   <button onClick={()=>setGameStarted(true)}>Start Game</button>
   <button onClick={()=>generateBox()}>new Box</button>
   <Canvas>
    <OrthographicCamera
        makeDefault
        left={-width/2}
        right={width/2}
        top={height/2}
        bottom={-height/2}
        near={1} far={100}
        zoom={100}
        position={getCameraPosition()}
        rotation={[-0.5,0,0]}
        lookAt={[0,0,0]}
    />
    <ambientLight intensity={0.6}/>
    <directionalLight position={[10,20,0]} intensity={0.6}/>
    <group rotation={[0,Math.PI/4,0]}>
        {renderBoxes()}
        <BoxModel positionHeight={0} base={true}/>
    </group>
   </Canvas>
   </>
  );
}

export default App;
