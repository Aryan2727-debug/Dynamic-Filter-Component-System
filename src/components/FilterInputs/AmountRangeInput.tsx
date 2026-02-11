import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import type { RangeValue } from '../../types';

interface AmountRangeInputProps {
  value: RangeValue;
  onChange: (value: RangeValue) => void;
}

/**
 * AmountRangeInput - Amount/currency range input with min and max fields
 * Used for operator: between (amount range)
 * Displays currency formatting with $ symbol
 */
const AmountRangeInput: React.FC<AmountRangeInputProps> = ({ value, onChange }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange({
      ...value,
      min: inputValue === '' ? null : Number(inputValue),
    });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange({
      ...value,
      max: inputValue === '' ? null : Number(inputValue),
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        size="small"
        type="number"
        value={value.min === null ? '' : value.min}
        onChange={handleMinChange}
        placeholder="Min"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        sx={{ minWidth: 130 }}
      />
      <Box sx={{ color: 'text.secondary' }}>to</Box>
      <TextField
        size="small"
        type="number"
        value={value.max === null ? '' : value.max}
        onChange={handleMaxChange}
        placeholder="Max"
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        sx={{ minWidth: 130 }}
      />
    </Box>
  );
};

export default AmountRangeInput;
