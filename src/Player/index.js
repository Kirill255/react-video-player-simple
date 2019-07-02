import React from "react";

import video from "./video.mp4";

import "./style.scss";

export const Player = () => {
  const isPlaying = false;

  const playControl = isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>;

  return (
    <div className="player">
      <video src={video} />
      <div className="controls">
        <div className="progress">
          <div className="filled" />
        </div>
        <button title="Toggle Play">{playControl}</button>
        <input className="slider" max="1" min="0" name="volume" step="0.05" type="range" />
        <button data-skip="-10">« 10s</button>
        <button data-skip="25">25s »</button>
        <button>&#10021;</button>
      </div>
    </div>
  );
};
