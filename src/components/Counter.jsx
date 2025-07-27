import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Leads: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add Lead</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default Counter;