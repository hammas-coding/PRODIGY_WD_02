import React, { useState, useEffect } from "react";
import styles from "./Stopwatch.module.css";
import { Container, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faRedo,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState(() => {
    const savedLaps = localStorage.getItem("laps");
    return savedLaps ? JSON.parse(savedLaps) : [];
  });

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("laps", JSON.stringify(laps));
  }, [laps]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    localStorage.removeItem("laps");
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  const handleRemoveLap = (indexToRemove) => {
    const updatedLaps = laps.filter((_, index) => index !== indexToRemove);
    setLaps(updatedLaps);
  };

  const formatTime = (time) => {
    const getMilliseconds = `0${(time % 1000) / 10}`.slice(-2);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 60000) % 60);
    const getSeconds = `0${seconds}`.slice(-2);
    const getMinutes = `0${minutes}`.slice(-2);
    return `${getMinutes}:${getSeconds}:${getMilliseconds}`;
  };

  return (
    <Container fluid className={styles.container}>
      <Col className={styles.top}>
        <p className={styles.stopwatchText}>Stopwatch</p>
        <p className={styles.timerText}>{formatTime(time)}</p>
        <div className={styles.buttonDiv}>
          <div className={styles.buttonInnerFirst}>
            <button onClick={handleStartPause}>
              <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
              <span className={styles.buttonInnerText}>
                {isRunning ? "Pause" : "Start"}
              </span>
            </button>
            <button onClick={handleLap} disabled={!isRunning}>
              <FontAwesomeIcon icon={faStopwatch} />
              <span className={styles.buttonInnerText}>Lap</span>
            </button>
          </div>
          <div className={styles.buttonInnerSecond}>
            <button onClick={handleReset}>
              <FontAwesomeIcon icon={faRedo} />
              <span className={styles.buttonInnerText}>Reset</span>
            </button>
          </div>
        </div>
      </Col>
      <Col className={styles.bottom}>
        {laps.length === 0 ? (
          <div className={styles.bottomAlternative}>
            <p className={styles.bottomAlternativeText}>Laps</p>
          </div>
        ) : (
          <div className={styles.bottomInner}>
            {laps.length > 0 && (
              <p className={styles.lapDesText}>
                Click to on lap to remove that lap
              </p>
            )}
            {laps.map((lap, index) => (
              <div
                key={index}
                className={styles.lap}
                onClick={() => handleRemoveLap(index)}
              >
                <div className={styles.lapText}>
                  <span className={styles.lapInnerText}>Lap {index + 1}</span>
                  <span className={styles.lapInnerText}>{formatTime(lap)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Col>
    </Container>
  );
};

export default Stopwatch;
