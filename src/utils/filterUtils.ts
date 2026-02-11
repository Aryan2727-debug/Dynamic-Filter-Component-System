import type {
  FilterCondition,
  FilterOperator,
  DateRangeValue,
  RangeValue,
  Employee,
} from '../types';

// ============================================
// UTILITY: Get nested value from object using dot notation
// Example: getNestedValue(employee, 'address.city') returns employee.address.city
// ============================================
export const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
};

// ============================================
// TEXT FILTERING - Case-insensitive text operations
// ============================================
const filterText = (value: string, filterValue: string, operator: FilterOperator): boolean => {
  const lowerValue = value.toLowerCase();
  const lowerFilter = filterValue.toLowerCase();

  switch (operator) {
    case 'equals':
      return lowerValue === lowerFilter;
    case 'contains':
      return lowerValue.includes(lowerFilter);
    case 'startsWith':
      return lowerValue.startsWith(lowerFilter);
    case 'endsWith':
      return lowerValue.endsWith(lowerFilter);
    case 'doesNotContain':
      return !lowerValue.includes(lowerFilter);
    default:
      return true;
  }
};

// ============================================
// NUMBER FILTERING - Numeric comparisons
// ============================================
const filterNumber = (value: number, filterValue: number, operator: FilterOperator): boolean => {
  switch (operator) {
    case 'equals':
      return value === filterValue;
    case 'greaterThan':
      return value > filterValue;
    case 'lessThan':
      return value < filterValue;
    case 'greaterThanOrEqual':
      return value >= filterValue;
    case 'lessThanOrEqual':
      return value <= filterValue;
    default:
      return true;
  }
};

// ============================================
// DATE FILTERING - Date range comparisons
// ============================================
const filterDateRange = (value: string, filterValue: DateRangeValue): boolean => {
  const date = new Date(value);
  const { startDate, endDate } = filterValue;

  // If both dates are null/empty, don't filter
  if (!startDate && !endDate) return true;

  // Check start date
  if (startDate) {
    const start = new Date(startDate);
    if (date < start) return false;
  }

  // Check end date
  if (endDate) {
    const end = new Date(endDate);
    // Set end date to end of day for inclusive comparison
    end.setHours(23, 59, 59, 999);
    if (date > end) return false;
  }

  return true;
};

// ============================================
// AMOUNT/RANGE FILTERING - Min/Max range comparisons
// ============================================
const filterAmountRange = (value: number, filterValue: RangeValue): boolean => {
  const { min, max } = filterValue;

  // If both are null/empty, don't filter
  if (min === null && max === null) return true;
  if (min === '' && max === '') return true;

  // Check minimum
  if (min !== null && min !== '') {
    const minNum = typeof min === 'string' ? parseFloat(min) : min;
    if (!isNaN(minNum) && value < minNum) return false;
  }

  // Check maximum
  if (max !== null && max !== '') {
    const maxNum = typeof max === 'string' ? parseFloat(max) : max;
    if (!isNaN(maxNum) && value > maxNum) return false;
  }

  return true;
};

// ============================================
// SINGLE SELECT FILTERING - Is/Is Not comparisons
// ============================================
const filterSingleSelect = (value: string, filterValue: string, operator: FilterOperator): boolean => {
  const lowerValue = value.toLowerCase();
  const lowerFilter = filterValue.toLowerCase();

  switch (operator) {
    case 'is':
      return lowerValue === lowerFilter;
    case 'isNot':
      return lowerValue !== lowerFilter;
    default:
      return true;
  }
};

// ============================================
// MULTI-SELECT FILTERING - In/Not In for arrays
// ============================================
const filterMultiSelect = (value: string[], filterValues: string[], operator: FilterOperator): boolean => {
  if (!filterValues || filterValues.length === 0) return true;

  // Convert both to lowercase for case-insensitive comparison
  const lowerValues = value.map(v => v.toLowerCase());
  const lowerFilters = filterValues.map(f => f.toLowerCase());

  switch (operator) {
    case 'in':
      // Returns true if the record contains ANY of the selected filter values
      return lowerFilters.some(filter => lowerValues.includes(filter));
    case 'notIn':
      // Returns true if the record does NOT contain ANY of the selected filter values
      return !lowerFilters.some(filter => lowerValues.includes(filter));
    default:
      return true;
  }
};

// ============================================
// BOOLEAN FILTERING - True/False matching
// ============================================
const filterBoolean = (value: boolean, filterValue: boolean): boolean => {
  return value === filterValue;
};

// ============================================
// CHECK IF FILTER HAS VALID VALUE
// ============================================
const hasValidFilterValue = (filter: FilterCondition): boolean => {
  const { value, operator } = filter;

  // Handle null/undefined
  if (value === null || value === undefined) return false;

  // Handle empty string
  if (value === '') return false;

  // Handle range values (for date and amount)
  if (operator === 'between') {
    if (typeof value === 'object' && value !== null) {
      // Check for DateRangeValue
      if ('startDate' in value || 'endDate' in value) {
        const dateRange = value as DateRangeValue;
        return !!(dateRange.startDate || dateRange.endDate);
      }
      // Check for RangeValue
      if ('min' in value || 'max' in value) {
        const range = value as RangeValue;
        return range.min !== null && range.min !== '' || range.max !== null && range.max !== '';
      }
    }
    return false;
  }

  // Handle array values (for multiSelect)
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
};

// ============================================
// APPLY SINGLE FILTER TO A RECORD
// ============================================
const applyFilter = (record: Employee, filter: FilterCondition): boolean => {
  const { field, operator, value } = filter;

  // Get the field value from the record (supports nested fields like 'address.city')
  const fieldValue = getNestedValue(record as unknown as Record<string, unknown>, field);

  // Handle null/undefined field values
  if (fieldValue === null || fieldValue === undefined) {
    return false;
  }

  // Apply appropriate filter based on value type
  // TEXT filtering
  if (typeof fieldValue === 'string' && typeof value === 'string') {
    // Check if this might be a single select field
    if (operator === 'is' || operator === 'isNot') {
      return filterSingleSelect(fieldValue, value, operator);
    }
    return filterText(fieldValue, value, operator);
  }

  // NUMBER filtering
  if (typeof fieldValue === 'number' && typeof value === 'number') {
    return filterNumber(fieldValue, value, operator);
  }

  // AMOUNT RANGE filtering (for salary, etc.)
  if (typeof fieldValue === 'number' && operator === 'between' && typeof value === 'object' && value !== null) {
    if ('min' in value || 'max' in value) {
      return filterAmountRange(fieldValue, value as RangeValue);
    }
  }

  // DATE RANGE filtering
  if (typeof fieldValue === 'string' && operator === 'between' && typeof value === 'object' && value !== null) {
    if ('startDate' in value || 'endDate' in value) {
      return filterDateRange(fieldValue, value as DateRangeValue);
    }
  }

  // MULTI-SELECT filtering (for array fields like skills)
  if (Array.isArray(fieldValue) && Array.isArray(value)) {
    return filterMultiSelect(fieldValue, value, operator);
  }

  // BOOLEAN filtering
  if (typeof fieldValue === 'boolean' && typeof value === 'boolean') {
    return filterBoolean(fieldValue, value);
  }

  return true;
};

// ============================================
// MAIN FILTER FUNCTION - Applies all filters to data
// Logic: AND between different fields, filters with same field are grouped with OR
// ============================================
export const applyFilters = (
  data: Employee[],
  filters: FilterCondition[]
): Employee[] => {
  // Get only filters with valid values
  const validFilters = filters.filter(hasValidFilterValue);

  // If no valid filters, return all data
  if (validFilters.length === 0) {
    return data;
  }

  // Group filters by field for OR logic within same field
  const filtersByField = validFilters.reduce((acc, filter) => {
    if (!acc[filter.field]) {
      acc[filter.field] = [];
    }
    acc[filter.field].push(filter);
    return acc;
  }, {} as Record<string, FilterCondition[]>);

  // Apply filters with AND between different fields, OR within same field
  return data.filter(record => {
    // For each field group, at least one filter must pass (OR within field)
    return Object.values(filtersByField).every(fieldFilters => {
      // OR logic: at least one filter in this field group must pass
      return fieldFilters.some(filter => applyFilter(record, filter));
    });
  });
};

// ============================================
// GENERATE UNIQUE ID FOR FILTERS
// ============================================
export const generateFilterId = (): string => {
  return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
