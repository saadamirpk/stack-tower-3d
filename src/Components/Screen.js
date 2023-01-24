import React from "react";

const Screen = ({ score, startGame }) => {
    return (
        <>
            <div className="screen">
                {score > 0 ? (
                    <>
                        <h4>SCORE</h4>
                        <h4>{score}</h4>
                        <button className="again" onClick={() => startGame()}>
                            Play Again
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text--glitch" data-text="Stack Game">
                            Stack Game
                        </p>
                        <button onClick={() => startGame()}>START</button>
                    </>
                )}
            </div>
        </>
    );
};

export default Screen;
