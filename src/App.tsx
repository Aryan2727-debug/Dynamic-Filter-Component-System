import { useState, useMemo, useCallback } from 'react';
import { Container, Typography, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { FilterBuilder } from './components/FilterBuilder';
import { DataTable } from './components/DataTable';
import { employeeData, fieldDefinitions } from './data/employeeData';
import { applyFilters } from './utils/filterUtils';
import type { FilterCondition } from './types';

// Create a simple MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
    },
  },
});

/**
 * App - Main application component
 * Manages filter state and integrates FilterBuilder with DataTable
 */
function App() {
  // State for filter conditions
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Memoized filtered data - only recalculates when data or filters change
  const filteredData = useMemo(() => {
    return applyFilters(employeeData, filters);
  }, [filters]);

  // Handler for filter changes - using useCallback to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters: FilterCondition[]) => {
    setFilters(newFilters);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Dynamic Filter Component System
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A reusable, type-safe dynamic filter component for data tables. 
              Add filters to narrow down the employee records below.
            </Typography>
          </Box>

          {/* Filter Builder */}
          <FilterBuilder
            filters={filters}
            fields={fieldDefinitions}
            onFiltersChange={handleFiltersChange}
          />

          {/* Data Table */}
          <DataTable 
            data={filteredData} 
            totalRecords={employeeData.length} 
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App
