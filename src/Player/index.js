import React, { useState, useEffect, useRef } from "react";

import video from "./video.mp4";

import "./style.scss";

export const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProgressCapturing, setIsProgressCapturing] = useState(false); // нажата ли в данный момент кнопка мыши, нужно для time scrubbing'а не просто по клику в точку на временной шкале, а с зажатой кнопкой мыши и протягиванием шкалы до нужной позиции
  const videoRef = useRef(null);

  // вкл/выкл видео по нажатию на пробел
  useEffect(() => {
    // https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent https://keycode.info/
    const handler = (event) => {
      // console.log(event);
      // if ((event.keyCode || event.which) === 32 || event.key === " ") {
      //   togglePlay();
      // }

      if (event.code === "Space") {
        togglePlay();
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, []);

  const playControl = isPlaying ? <>&#10074;&#10074;</> : <>&#9654;</>; // икноки для кнопки play/pause ▶/❚❚, в данном случае для икноки pause мы используем символ вертикальной черты ❚ (&#10074;), повторённый дважды ❚❚, так как символа pause нету http://an-site.ru/sim.htm

  const togglePlay = () => {
    const method = videoRef.current.paused ? "play" : "pause"; // смотрим нативное свойство paused html-тэга video, оно равно true/false
    videoRef.current[method](); // вызываем нативные методы html-тэга video https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement HTMLMediaElement.pause() или HTMLMediaElement.play()
    setIsPlaying(method === "play"); // устанавливается true/false, в зависимости от этоо у нас меняется отображение иконки на кнопке play/pause
  };

  // прокручиваем прогресс проигрывания вперёд/назад
  const skip = (event) => {
    const seconds = event.target.dataset["skip"]; // event.target.dataset.skip, берём занчение дата-атрибута data-skip="-10"
    videoRef.current.currentTime += Number.parseFloat(seconds); // currentTime += 25 or currentTime += -10
  };

  // устанавливаем прогресс проигранного видео в процентах, вызываем эту функцию при наступлении нативного события timeupdate у html-тэга video, timeupdate вызывается когда время в currentTime было обновлено
  const handleProgress = () => {
    const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100; // сколько видео воспроизвелось на данный момент в процентах, текущий прогресс
    setProgress(percent);
  };

  // устанавливаем прогресс видео указателем мыши при клике
  const scrub = (event) => {
    // offsetX — свойство события мыши, возвращает расстояние от «начала» элемента до позиции указателя мыши по координате X
    // nativeEvent — ссылка на нативное, НЕ кросс-браузерное событие
    // offsetWidth — возвращает ширину элемента
    // О разнице между event.target и event.currentTarget: https://github.com/facebook/react/issues/5733#issuecomment-167188516

    const scrubTime =
      (event.nativeEvent.offsetX / event.currentTarget.offsetWidth) * videoRef.current.duration; // время в которое нужно перемотать, тоесть мы получаем физическую точку(offsetX), в которую мы кликнули на временной шкале прогресса(offsetWidth) и переводим её во время
    videoRef.current.currentTime = scrubTime;
  };

  const toggleVolume = (event) => {
    videoRef.current.volume = event.currentTarget.value; // берём значение инпута(0-1 с шагом 0.05) и устанавливаем нативное свойство volume html-тэга video
  };

  const toggleSpeed = (event) => {
    videoRef.current.playbackRate = event.currentTarget.value; // берём значение инпута(0.5-2 с шагом 0.1) и устанавливаем нативное свойство playbackRate html-тэга video
  };

  const toggleFullscreen = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/FullscreenOptions/navigationUI
    const fullscreenOptions = {
      navigationUI: "auto" // default
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
    if (!document.fullscreenElement) {
      videoRef.current
        .requestFullscreen(fullscreenOptions)
        .then(() => {
          console.log("Full-screen mode");
        })
        .catch((err) => {
          // prettier-ignore
          console.log(`An error occurred while trying to switch into full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
      document.exitFullscreen();
    }
  };

  console.log(progress);

  return (
    <div className="player">
      <video src={video} ref={videoRef} onClick={togglePlay} onTimeUpdate={handleProgress} />
      <div className="controls">
        <div
          className="progress"
          onClick={scrub}
          onMouseDown={() => setIsProgressCapturing(true)}
          onMouseMove={(event) => isProgressCapturing && scrub(event)}
          onMouseUp={() => setIsProgressCapturing(false)}
        >
          >
          <div
            className="filled"
            style={{
              "--filledProgressBar": `${progress}%`
            }}
          />
        </div>
        <button title="Toggle Play" onClick={togglePlay}>
          {playControl}
        </button>
        <input
          className="slider"
          max="1"
          min="0"
          name="volume"
          step="0.05"
          type="range"
          onChange={toggleVolume}
        />
        <input
          className="slider"
          max="2"
          min="0.5"
          name="playbackRate"
          step="0.1"
          type="range"
          onChange={toggleSpeed}
        />
        <button data-skip="-10" onClick={skip}>
          « 10s
        </button>
        <button data-skip="25" onClick={skip}>
          25s »
        </button>
        <button onClick={toggleFullscreen}>&#10021;</button>
      </div>
    </div>
  );
};
