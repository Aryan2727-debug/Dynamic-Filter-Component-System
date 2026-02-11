import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import type { Employee, SortConfig, SortDirection } from '../../types';
import { getNestedValue } from '../../utils/filterUtils';

interface DataTableProps {
  data: Employee[];
  totalRecords: number;
}

// Column definitions for the table
interface ColumnDefinition {
  key: string;
  label: string;
  sortable: boolean;
  width?: number;
  render?: (value: unknown, row: Employee) => React.ReactNode;
}

/**
 * DataTable - Sortable table component to display employee data
 * Features: Sorting, formatted display, responsive design
 */
const DataTable: React.FC<DataTableProps> = ({ data, totalRecords }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Column definitions with custom renderers
  const columns: ColumnDefinition[] = [
    { key: 'id', label: 'ID', sortable: true, width: 60 },
    { key: 'name', label: 'Name', sortable: true, width: 150 },
    { key: 'email', label: 'Email', sortable: true, width: 200 },
    { key: 'department', label: 'Department', sortable: true, width: 120 },
    { key: 'role', label: 'Role', sortable: true, width: 180 },
    {
      key: 'salary',
      label: 'Salary',
      sortable: true,
      width: 100,
      render: (value) => `$${(value as number).toLocaleString()}`,
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      width: 110,
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      width: 90,
      render: (value) => (
        <Chip
          label={value ? 'Active' : 'Inactive'}
          color={value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      key: 'skills',
      label: 'Skills',
      sortable: false,
      width: 200,
      render: (value) => {
        const skills = value as string[];
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {skills.slice(0, 2).map((skill) => (
              <Chip key={skill} label={skill} size="small" variant="outlined" />
            ))}
            {skills.length > 2 && (
              <Tooltip title={skills.slice(2).join(', ')}>
                <Chip label={`+${skills.length - 2}`} size="small" variant="outlined" />
              </Tooltip>
            )}
          </Box>
        );
      },
    },
    {
      key: 'address.city',
      label: 'City',
      sortable: true,
      width: 120,
    },
    {
      key: 'address.state',
      label: 'State',
      sortable: true,
      width: 80,
    },
    { key: 'projects', label: 'Projects', sortable: true, width: 80 },
    {
      key: 'performanceRating',
      label: 'Rating',
      sortable: true,
      width: 80,
      render: (value) => (
        <Chip
          label={(value as number).toFixed(1)}
          size="small"
          color={
            (value as number) >= 4.5
              ? 'success'
              : (value as number) >= 4.0
              ? 'primary'
              : (value as number) >= 3.5
              ? 'warning'
              : 'error'
          }
        />
      ),
    },
  ];

  // Handle sort request
  const handleSort = (columnKey: string) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Sort data based on current sort config
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a as unknown as Record<string, unknown>, sortConfig.key);
      const bValue = getNestedValue(b as unknown as Record<string, unknown>, sortConfig.key);

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = aValue === bValue ? 0 : aValue ? -1 : 1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Get cell value for display
  const getCellValue = (row: Employee, column: ColumnDefinition): React.ReactNode => {
    const value = getNestedValue(row as unknown as Record<string, unknown>, column.key);
    
    if (column.render) {
      return column.render(value, row);
    }
    
    if (value === null || value === undefined) {
      return '-';
    }
    
    return String(value);
  };

  return (
    <Paper elevation={1}>
      {/* Record Count Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Employee Data</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing: <strong>{data.length}</strong> records
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: <strong>{totalRecords}</strong> records
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      {data.length === 0 ? (
        <Box
          sx={{
            p: 6,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6">No results found</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try adjusting your filters to see more results
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'grey.100',
                      width: column.width,
                      minWidth: column.width,
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={sortConfig?.key === column.key}
                        direction={sortConfig?.key === column.key ? sortConfig.direction : 'asc'}
                        onClick={() => handleSort(column.key)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.50' } }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>{getCellValue(row, column)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default DataTable;
