import React from 'react';
import { FormControlLabel, Switch, Box } from '@mui/material';

interface BooleanInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

/**
 * BooleanInput - Toggle switch for boolean field filtering
 * Used for operator: is (boolean)
 */
const BooleanInput: React.FC<BooleanInputProps> = ({ value, onChange, label }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            color="primary"
          />
        }
        label={label || (value ? 'True' : 'False')}
      />
    </Box>
  );
};

export default BooleanInput;
