import React, { useState, useRef } from "react";

import video from "./video.mp4";

import "./style.scss";

export const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const playControl = isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>; // икноки для кнопки play/pause ▶/❚❚, в данном случае для икноки pause мы используем символ вертикальной черты ❚ (&#10074;), повторённый дважды ❚❚, так как символа pause нету http://an-site.ru/sim.htm

  const togglePlay = () => {
    const method = videoRef.current.paused ? "play" : "pause"; // смотрим нативное свойство paused html-тэга video, оно равно true/false
    videoRef.current[method](); // вызываем нативные методы html-тэга video https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement HTMLMediaElement.pause() или HTMLMediaElement.play()
    setIsPlaying(method === "play"); // устанавливается true/false, в зависимости от этоо у нас меняется отображение иконки на кнопке play/pause
  };

  return (
    <div className="player">
      <video src={video} ref={videoRef} onClick={togglePlay} />
      <div className="controls">
        <div className="progress">
          <div className="filled" />
        </div>
        <button title="Toggle Play" onClick={togglePlay}>
          {playControl}
        </button>
        <input className="slider" max="1" min="0" name="volume" step="0.05" type="range" />
        <button data-skip="-10">« 10s</button>
        <button data-skip="25">25s »</button>
        <button>&#10021;</button>
      </div>
    </div>
  );
};
