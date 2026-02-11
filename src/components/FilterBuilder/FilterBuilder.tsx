import React from 'react';
import { Box, Button, Typography, Paper, Divider } from '@mui/material';
import { Plus, X, Filter } from 'lucide-react';
import type { FilterCondition, FieldDefinition } from '../../types';
import { generateFilterId } from '../../utils/filterUtils';
import FilterRow from './FilterRow';

interface FilterBuilderProps {
  filters: FilterCondition[];
  fields: FieldDefinition[];
  onFiltersChange: (filters: FilterCondition[]) => void;
}

/**
 * FilterBuilder - Main component for building filter conditions
 * Manages multiple FilterRow components and provides add/clear functionality
 */
const FilterBuilder: React.FC<FilterBuilderProps> = ({
  filters,
  fields,
  onFiltersChange,
}) => {
  // Add a new filter with default values
  const handleAddFilter = () => {
    const defaultField = fields[0];
    const newFilter: FilterCondition = {
      id: generateFilterId(),
      field: defaultField.key,
      operator: defaultField.type === 'text' ? 'contains' : 
               defaultField.type === 'number' ? 'equals' :
               defaultField.type === 'date' ? 'between' :
               defaultField.type === 'amount' ? 'between' :
               defaultField.type === 'singleSelect' ? 'is' :
               defaultField.type === 'multiSelect' ? 'in' :
               'is',
      value: defaultField.type === 'date' ? { startDate: null, endDate: null } :
             defaultField.type === 'amount' ? { min: null, max: null } :
             defaultField.type === 'multiSelect' ? [] :
             defaultField.type === 'boolean' ? true :
             '',
    };
    onFiltersChange([...filters, newFilter]);
  };

  // Update a specific filter
  const handleUpdateFilter = (filterId: string, updates: Partial<FilterCondition>) => {
    onFiltersChange(
      filters.map((f) => (f.id === filterId ? { ...f, ...updates } : f))
    );
  };

  // Remove a specific filter
  const handleRemoveFilter = (filterId: string) => {
    onFiltersChange(filters.filter((f) => f.id !== filterId));
  };

  // Clear all filters
  const handleClearAll = () => {
    onFiltersChange([]);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Filter size={20} />
          <Typography variant="h6">Filters</Typography>
          {filters.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              ({filters.length} active)
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={handleAddFilter}
          >
            Add Filter
          </Button>
          {filters.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<X size={16} />}
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Filter Rows */}
      {filters.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">No filters applied</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Click "Add Filter" to start filtering the data
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filters.map((filter, index) => (
            <Box key={filter.id}>
              {index > 0 && (
                <Typography
                  variant="body2"
                  sx={{ 
                    color: 'text.secondary', 
                    textAlign: 'center', 
                    my: 1,
                    fontWeight: 500,
                  }}
                >
                  AND
                </Typography>
              )}
              <FilterRow
                filter={filter}
                fields={fields}
                onUpdate={handleUpdateFilter}
                onRemove={handleRemoveFilter}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Filter Logic Info */}
      {filters.length > 1 && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.dark">
            <strong>Tip:</strong> Filters on different fields use AND logic. 
            Multiple filters on the same field use OR logic.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FilterBuilder;
