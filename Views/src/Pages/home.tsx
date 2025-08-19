import { useState } from "react";
import "../Style/default.css";
import "../Style/counter.css";

export const DefaultPage = () => {
  return (
    <div className="app" role="main">
      <article className="app-article">
        <img src="/bunlogo.svg" className="app-logo" alt="logo" />
        <div className="break-0" />
        <h3>Welcome to Prct!</h3>
        <div className="break-1"></div>
        <Counter />
      </article>
    </div>
  );
};

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="counter">
      <h2 className="counter-title">Counter</h2>
      <div className="counter-display">
        <span className="counter-value">{count}</span>
      </div>
      <div className="counter-buttons">
        <button
          className="counter-button counter-button-decrement"
          onClick={decrement}
          aria-label="Decrease counter"
        >
          -
        </button>
        <button
          className="counter-button counter-button-reset"
          onClick={reset}
          aria-label="Reset counter"
        >
          Reset
        </button>
        <button
          className="counter-button counter-button-increment"
          onClick={increment}
          aria-label="Increase counter"
        >
          +
        </button>
      </div>
    </div>
  );
};
