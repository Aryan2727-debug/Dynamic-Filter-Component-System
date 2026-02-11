import React from 'react';
import { TextField } from '@mui/material';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * TextInput - Simple text input component for text field filtering
 * Used for operators: equals, contains, startsWith, endsWith, doesNotContain
 */
const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder = 'Enter value...' }) => {
  return (
    <TextField
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth
      sx={{ minWidth: 200 }}
    />
  );
};

export default TextInput;
