import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  Chip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { SelectOption } from '../../types';

interface MultiSelectInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * MultiSelectInput - Multi-select dropdown with checkboxes
 * Used for operators: in, notIn
 * Allows selecting multiple values from a list
 */
const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select values...',
}) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValues = event.target.value;
    // SelectChangeEvent returns string[] for multiple select
    onChange(typeof selectedValues === 'string' ? selectedValues.split(',') : selectedValues);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 250 }}>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <span style={{ color: '#9e9e9e' }}>{placeholder}</span>;
          }
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.slice(0, 2).map((val) => {
                const option = options.find((opt) => opt.value === val);
                return (
                  <Chip key={val} label={option?.label || val} size="small" />
                );
              })}
              {selected.length > 2 && (
                <Chip label={`+${selected.length - 2} more`} size="small" />
              )}
            </Box>
          );
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.indexOf(option.value) > -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelectInput;
