---
title: 常用的自定Hooks
date: 2020-05-20
tags:
  - React基础
categories:
  - React
---

- Service 请求 Hook 封装

通过 useAsync 我们可以很轻松的获取到 myFunction 的执行状态。

```js
import React, { useState, useEffect, useCallback } from 'react';

// Usage
function App() {
  const { execute, pending, value, error } = useAsync(myFunction, false);

  return (
    <div>
      {value && <div>{value}</div>}
      {error && <div>{error}</div>}
      <button onClick={execute} disabled={pending}>
        {!pending ? 'Click me' : 'Loading...'}
      </button>
    </div>
  );
}

// An async function for testing our hook.
// Will be successful 50% of the time.
const myFunction = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random() * 10;
      rnd <= 5 ? resolve('Submitted successfully 🙌') : reject('Oh no there was an error 😞');
    }, 2000);
  });
};

// Hook
const useAsync = (asyncFunction, immediate = true) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setPending(true);
    setValue(null);
    setError(null);
    return asyncFunction()
      .then((response) => setValue(response))
      .catch((error) => setError(error))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, pending, value, error };
};

export default App;
```

- 监听事件 Hooks 封装
  对于一些事件(鼠标移入移出, 点击)等的封装

```js
import React, { useState, useEffect, useCallback, useRef } from 'react';

// Usage
function App() {
  // State for storing mouse coordinates
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Event handler utilizing useCallback ...
  // ... so that reference never changes.
  const handler = useCallback(
    ({ clientX, clientY }) => {
      // Update coordinates
      setCoords({ x: clientX, y: clientY });
    },
    [setCoords]
  );

  // Add event listener using our hook
  useEventListener('mousemove', handler);

  return (
    <h1>
      The mouse position is ({coords.x}, {coords.y})
    </h1>
  );
}

// Hook
function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
}

export default App;
```

- 检查子组件因为什么而重新渲染

  ```js

  import React, { useState, useMemo } from 'react';
  import ReactDOM from 'react-dom';
  import useWhyDidYouUpdate from './use-why-did-you-update';

  const Counter = React.memo(props => {
    useWhyDidYouUpdate('Counter', props);
    return <div style={props.style}>{props.count}</div>;
  });

  function App() {

  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState(0);

  const counterStyle = useMemo(() => {
      return {
        fontSize: '3rem',
        color: 'red'
        }
  }, [])

    return (
        <div>
        <div className="counter">
        <Counter count={count} style={counterStyle} />
        <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
        <div className="user">
        <img src={`http://i.pravatar.cc/80?img=${userId}`} />
        <button onClick={() => setUserId(userId + 1)}>Switch User</button>
        </div>
        </div>
    );
    }

    const rootElement = document.getElementById('root');
    ReactDOM.render(<App />, rootElement);
  ```

- 根据当前最小分辨率获取当前column数量

    ```js
      import { useEffect, useState } from 'react';
      export default function useMedia(queries, values, defaultValue) {
        // Array containing a media query list for each query
        const mediaQueryLists = queries.map(q => window.matchMedia(q));

        // Function that gets value based on matching media query
        const getValue = () => {
          // Get index of first media query that matches
          const index = mediaQueryLists.findIndex(mql => mql.matches);
          // Return related value or defaultValue if none
          return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
        };

        // State and setter for matched value
        const [value, setValue] = useState(getValue);

        useEffect(
          () => {
            // Event listener callback
            // Note: By defining getValue outside of useEffect we ensure that it has ...
            // ... current values of hook args (as this hook only runs on mount/dismount).
            const handler = () => setValue(getValue);
            // Set a listener for each media query with above handler as callback.
            mediaQueryLists.forEach(mql => mql.addListener(handler));
            // Remove listeners on cleanup
            return () => mediaQueryLists.forEach(mql => mql.removeListener(handler));
          },
          [] // Empty array ensures effect is only run on mount and unmount
        );

        return value;
      }
    ```

    
    ```js
    const columnCount = useMedia(
        // Media queries
        ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'],
        // Column counts (relates to above media queries by array index)
        [7, 6, 5],
        // Default column count
        2
      );
    ```

    - 当我们的内容过于长的时候, 如果我们想要锁定滚动条

    ```js
    import { useLayoutEffect } from 'react';

    export default function useLockBodyScroll() {
      useLayoutEffect(() => {
      // Get original value of body overflow
      const originalStyle = window.getComputedStyle(document.body).overflow;  
      // Prevent scrolling on mount
      document.body.style.overflow = 'hidden';
      // Re-enable scrolling when component unmounts
      return () => document.body.style.overflow = originalStyle;
      }, []); // Empty array ensures effect is only run on mount and unmount
    }
    ```

    ```js 
    function Modal({ title, content, onClose }) {
        useLockBodyScroll();
        return (
          <div className="modal-overlay" onClick={onClose}>
            <div className="modal">
              <h2>{title}</h2>
              <p>{content}</p>
            </div>
          </div>
        );
      }
    ```
    -  监听键盘按键的Hook
   
   ```js

  import { useState, useEffect } from 'react';

  export default function useKeyPress(targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    // If pressed key is our target key then set to true
    function downHandler({ key }) {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    }

    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    // Add event listeners
    useEffect(() => {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
  }
   ```

- 防抖Hook
   
   ```js

   import { useState, useEffect, useRef } from 'react';

    export default function useDebounce(value, delay) {
      // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
  }

   ```

   ```js
   const [searchTerm, setSearchTerm] = useState('');
   const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffct(() => {
      ....
    }, [debouncedSearchTerm])

      return (
            <input
              style={{
                width: '100%',
                fontSize: '2rem',
                padding: '0.4rem',
                marginBottom: '10px'
              }}
              placeholder="Search Marvel Comics"
              onChange={e => setSearchTerm(e.target.value)}
            />
      )

   ```