import './App.css';
import { useEffect, useRef, useState } from 'react';
import { beep } from './utils/beep';
import Footer from './components/Footer';

function App() {
  // ---- User Input ----
  // get cycle
  const [cycle, setCycle] = useState<number>(10);
  // get interval(in minutes), default to 15 mins
  const [timeInterval, setTimeInterval] = useState<number>(15);

  // local variable used in function
  // Unit: second
  const startTimeRef = useRef(15 * 60);
  const timeRef = useRef(15 * 60);
  const cycleRef = useRef(10);

  const [timeMinutes, setTimesMinutes] = useState<number>(0);
  const [timeSeconds, setTimesSeconds] = useState<number>(0);
  const [timerOn, setTimerOn] = useState<boolean>(false);

  // componentDidMount
  useEffect(() => {
    timeRef.current = timeInterval * 60;
    startTimeRef.current = timeInterval * 60;
    setTimesMinutes(Math.floor(startTimeRef.current / 60));
    setTimesSeconds(Math.floor(startTimeRef.current % 60));
  }, [timeInterval]);

  // when Timer set to On/Resume
  useEffect(() => {
    let interval: any = null;
    if (timerOn) {
      interval = setInterval(() => {
        if (timeRef.current > 0) {
          timeRef.current = timeRef.current - 1;
          setTimesMinutes(Math.floor(timeRef.current / 60));
          setTimesSeconds(Math.floor(timeRef.current % 60));
        } else {
          setCycle((prev) => (prev > 0 ? prev - 1 : prev));
          beep();
        }
      }, 1000);
    } else if (!timerOn) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    if (cycle > 0) {
      setTimesMinutes(Math.floor(startTimeRef.current / 60));
      setTimesSeconds(Math.floor(startTimeRef.current % 60));
      timeRef.current = startTimeRef.current;
    } else {
      onPauseHandler();
      onResetHandler();
    }
  }, [cycle]);

  // Function Handler
  const onStartHandler = () => setTimerOn(true);

  const onPauseHandler = () => setTimerOn(false);

  const onResetHandler = () => {
    // pause timer
    onPauseHandler();
    // reset to default
    timeRef.current = startTimeRef.current;
    setTimesMinutes(Math.floor(startTimeRef.current / 60));
    setTimesSeconds(Math.floor(startTimeRef.current % 60));
    setCycle(cycleRef.current);
  };

  const cycleChangeHandler = (increment: number) => {
    if (cycle > 0) {
      setCycle(cycle + increment);
      cycleRef.current = cycleRef.current + increment;
    } else {
      if (increment > 0) {
        setCycle(cycle + increment);
        cycleRef.current = cycleRef.current + increment;
      }
    }
  };

  const intervalChangeHandler = (increment: number) => {
    if (timeInterval > 1) {
      setTimeInterval(timeInterval + increment);
      startTimeRef.current = startTimeRef.current + increment * 60;
    } else {
      if (increment > 0) {
        setTimeInterval(timeInterval + increment);
        startTimeRef.current = startTimeRef.current + increment * 60;
      }
    }
  };

  return (
    <div className='container'>
      <h1 className='header'>Do Your Work</h1>
      <div className='cycle'>
        <h3>Cycle Left: {cycle}</h3>
        {!timerOn && (
          <div className='button-container'>
            <button className='button' onClick={() => cycleChangeHandler(1)}>
              +
            </button>
            <button className='button' onClick={() => cycleChangeHandler(-1)}>
              -
            </button>
          </div>
        )}
      </div>
      <div className='timer'>
        <h1>
          {timeMinutes > 9 ? timeMinutes : `0${timeMinutes}`}:
          {timeSeconds > 9 ? timeSeconds : `0${timeSeconds}`}
        </h1>
        {!timerOn && (
          <div className='button-container'>
            <button className='button' onClick={() => intervalChangeHandler(1)}>
              +
            </button>
            <button
              className='button'
              onClick={() => intervalChangeHandler(-1)}
            >
              -
            </button>
          </div>
        )}
      </div>

      <div className='control-button'>
        {!timerOn ? (
          <button onClick={onStartHandler}>Start</button>
        ) : (
          <button onClick={onPauseHandler}>Pause</button>
        )}
        <button onClick={onResetHandler}>Reset</button>
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default App;
