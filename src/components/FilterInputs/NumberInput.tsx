import React from 'react';
import { TextField } from '@mui/material';

interface NumberInputProps {
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder?: string;
}

/**
 * NumberInput - Number input component with validation for numeric filtering
 * Used for operators: equals, greaterThan, lessThan, greaterThanOrEqual, lessThanOrEqual
 */
const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, placeholder = 'Enter number...' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string for clearing the input
    if (inputValue === '') {
      onChange('');
      return;
    }

    // Allow valid numbers including decimals
    if (!isNaN(Number(inputValue))) {
      onChange(Number(inputValue));
    }
  };

  return (
    <TextField
      size="small"
      type="number"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      fullWidth
      sx={{ minWidth: 200 }}
      inputProps={{
        step: 'any', // Allow decimal inputs
      }}
    />
  );
};

export default NumberInput;
