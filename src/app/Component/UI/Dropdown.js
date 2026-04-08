import React, { useState } from 'react';

const Dropdown = ({ options, onChange, isInputRequired }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    // onChange(selectedValue); // Optional: Call a callback function on select change
  };

  return (
    <div className="relative inline-block w-full">
      
    <select
      className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      value={selectedOption}
      onChange={handleSelectChange}
      required={isInputRequired}
    >
      <option value="">Select an option</option>
      {options.map((option, key) => (
        <option key={key} value={option} >
          {option}
        </option>
    ))}
    
    </select>

  </div>
    
  );
};

export default Dropdown;