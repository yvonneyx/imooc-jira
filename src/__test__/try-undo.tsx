import React from 'react';
import { useUndo } from 'utils/use-undo';

export const UndoComponent = () => {
  const [
    countState,
    {
      set: setCount,
      reset: resetCount,
      undo: undoCount,
      redo: redoCount,
      canUndo,
      canRedo,
    },
  ] = useUndo(0);

  const { present: presentCount } = countState;

  return (
    <div>
      <p>You clicked {presentCount} times</p>
      <button key="increment" onClick={() => setCount(presentCount + 1)}>
        +
      </button>{' '}
      <button key="decrement" onClick={() => setCount(presentCount - 1)}>
        -
      </button>{' '}
      <button key="undo" onClick={undoCount} disabled={!canUndo}>
        undo
      </button>{' '}
      <button key="redo" onClick={redoCount} disabled={!canRedo}>
        redo
      </button>{' '}
      <button key="reset" onClick={() => resetCount(0)}>
        reset to 0
      </button>
    </div>
  );
};
