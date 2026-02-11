import React, { useMemo } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Trash2 } from 'lucide-react';
import type {
  FilterCondition,
  FieldDefinition,
  FilterOperator,
  FilterValue,
  DateRangeValue,
  RangeValue,
} from '../../types';
import {
  OPERATORS_BY_TYPE,
  OPERATOR_LABELS,
} from '../../types';
import {
  TextInput,
  NumberInput,
  DateRangeInput,
  AmountRangeInput,
  SingleSelectInput,
  MultiSelectInput,
  BooleanInput,
} from '../FilterInputs';

interface FilterRowProps {
  filter: FilterCondition;
  fields: FieldDefinition[];
  onUpdate: (filterId: string, updates: Partial<FilterCondition>) => void;
  onRemove: (filterId: string) => void;
}

/**
 * FilterRow - A single filter condition row
 * Contains: Field selector, Operator selector, Value input, Remove button
 * Dynamically renders appropriate input based on field type
 */
const FilterRow: React.FC<FilterRowProps> = ({ filter, fields, onUpdate, onRemove }) => {
  // Get the current field definition
  const currentField = useMemo(
    () => fields.find((f) => f.key === filter.field),
    [fields, filter.field]
  );

  // Get available operators for the current field type
  const availableOperators = useMemo(() => {
    if (!currentField) return [];
    return OPERATORS_BY_TYPE[currentField.type];
  }, [currentField]);

  // Handle field change
  const handleFieldChange = (event: SelectChangeEvent<string>) => {
    const newFieldKey = event.target.value;
    const newField = fields.find((f) => f.key === newFieldKey);

    if (newField) {
      // Get default operator for the new field type
      const newOperators = OPERATORS_BY_TYPE[newField.type];
      const defaultOperator = newOperators[0];

      // Get default value based on field type
      let defaultValue: FilterValue = '';
      if (newField.type === 'date') {
        defaultValue = { startDate: null, endDate: null };
      } else if (newField.type === 'amount') {
        defaultValue = { min: null, max: null };
      } else if (newField.type === 'multiSelect') {
        defaultValue = [];
      } else if (newField.type === 'boolean') {
        defaultValue = true;
      }

      onUpdate(filter.id, {
        field: newFieldKey,
        operator: defaultOperator,
        value: defaultValue,
      });
    }
  };

  // Handle operator change
  const handleOperatorChange = (event: SelectChangeEvent<string>) => {
    onUpdate(filter.id, {
      operator: event.target.value as FilterOperator,
    });
  };

  // Handle value change
  const handleValueChange = (newValue: FilterValue) => {
    onUpdate(filter.id, { value: newValue });
  };

  // Render the appropriate input component based on field type
  const renderValueInput = () => {
    if (!currentField) return null;

    switch (currentField.type) {
      case 'text':
        return (
          <TextInput
            value={(filter.value as string) || ''}
            onChange={(val) => handleValueChange(val)}
          />
        );

      case 'number':
        return (
          <NumberInput
            value={(filter.value as number | string) ?? ''}
            onChange={(val) => handleValueChange(val)}
          />
        );

      case 'date':
        return (
          <DateRangeInput
            value={(filter.value as DateRangeValue) || { startDate: null, endDate: null }}
            onChange={(val) => handleValueChange(val)}
          />
        );

      case 'amount':
        return (
          <AmountRangeInput
            value={(filter.value as RangeValue) || { min: null, max: null }}
            onChange={(val) => handleValueChange(val)}
          />
        );

      case 'singleSelect':
        return (
          <SingleSelectInput
            value={(filter.value as string) || ''}
            onChange={(val) => handleValueChange(val)}
            options={currentField.options || []}
          />
        );

      case 'multiSelect':
        return (
          <MultiSelectInput
            value={(filter.value as string[]) || []}
            onChange={(val) => handleValueChange(val)}
            options={currentField.options || []}
          />
        );

      case 'boolean':
        return (
          <BooleanInput
            value={(filter.value as boolean) ?? true}
            onChange={(val) => handleValueChange(val)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        backgroundColor: 'grey.50',
        borderRadius: 1,
        flexWrap: 'wrap',
      }}
    >
      {/* Field Selector */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select
          value={filter.field}
          onChange={handleFieldChange}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: '#9e9e9e' }}>Select field...</span>;
            }
            const field = fields.find((f) => f.key === selected);
            return field?.label || selected;
          }}
        >
          {fields.map((field) => (
            <MenuItem key={field.key} value={field.key}>
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Operator Selector */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select
          value={filter.operator}
          onChange={handleOperatorChange}
          displayEmpty
          disabled={!currentField}
        >
          {availableOperators.map((op) => (
            <MenuItem key={op} value={op}>
              {OPERATOR_LABELS[op]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Value Input - Dynamic based on field type */}
      <Box sx={{ flex: 1, minWidth: 200 }}>{renderValueInput()}</Box>

      {/* Remove Button */}
      <IconButton
        onClick={() => onRemove(filter.id)}
        color="error"
        size="small"
        title="Remove filter"
      >
        <Trash2 size={18} />
      </IconButton>
    </Box>
  );
};

export default FilterRow;
