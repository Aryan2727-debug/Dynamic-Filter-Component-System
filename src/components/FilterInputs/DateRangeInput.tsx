import React from 'react';
import { Box, TextField } from '@mui/material';
import type { DateRangeValue } from '../../types';

interface DateRangeInputProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
}

/**
 * DateRangeInput - Date range picker with start and end date inputs
 * Used for operator: between (date range)
 * Uses native HTML date inputs for simplicity
 */
const DateRangeInput: React.FC<DateRangeInputProps> = ({ value, onChange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      startDate: e.target.value || null,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      endDate: e.target.value || null,
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        size="small"
        type="date"
        value={value.startDate || ''}
        onChange={handleStartDateChange}
        label="From"
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 150 }}
      />
      <Box sx={{ color: 'text.secondary' }}>to</Box>
      <TextField
        size="small"
        type="date"
        value={value.endDate || ''}
        onChange={handleEndDateChange}
        label="To"
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: 150 }}
      />
    </Box>
  );
};

export default DateRangeInput;
