import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { SelectOption } from '../../types';

interface SingleSelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * SingleSelectInput - Dropdown select for single value selection
 * Used for operators: is, isNot
 */
const SingleSelectInput: React.FC<SingleSelectInputProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select value...',
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ color: '#9e9e9e' }}>{placeholder}</span>;
          }
          const option = options.find((opt) => opt.value === selected);
          return option?.label || selected;
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SingleSelectInput;
