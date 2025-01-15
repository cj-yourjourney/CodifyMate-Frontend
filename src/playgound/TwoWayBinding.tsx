import React, { useState } from 'react';

const TwoWayBindingExample: React.FC = () => {
  // State to hold the input value
  const [name, setName] = useState<string>('');

  // Handler to update the state when the input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value); // First way: Update state as user types
  };

  // Handler to change the state programmatically (for demonstration)
  const changeNameToAlice = () => {
    setName('Alice'); // This will update the input field as well (second way)
  };

  return (
    <div>
      <h1>Two-Way Data Binding Example</h1>
      <input
        type="text"
        value={name} // Bind the input value to the state
        onChange={handleInputChange} // Update state on input change
      />
      <p>You typed: {name}</p> {/* Display the current input value */}
      <button className='btn btn-primary' onClick={changeNameToAlice}>Change Name to Alice</button>
    </div>
  );
};

export default TwoWayBindingExample;