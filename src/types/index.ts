// ============================================
// FIELD TYPES - Defines all supported data types
// ============================================
export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'amount'
  | 'singleSelect'
  | 'multiSelect'
  | 'boolean';

// ============================================
// OPERATORS - Different operators for each field type
// ============================================
export type TextOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'doesNotContain';
export type NumberOperator = 'equals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
export type DateOperator = 'between';
export type AmountOperator = 'between';
export type SingleSelectOperator = 'is' | 'isNot';
export type MultiSelectOperator = 'in' | 'notIn';
export type BooleanOperator = 'is';

// Union of all operator types
export type FilterOperator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | AmountOperator
  | SingleSelectOperator
  | MultiSelectOperator
  | BooleanOperator;

// ============================================
// OPERATOR LABELS - Human-readable labels for operators
// ============================================
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'Equals',
  contains: 'Contains',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  doesNotContain: 'Does Not Contain',
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  greaterThanOrEqual: 'Greater Than or Equal',
  lessThanOrEqual: 'Less Than or Equal',
  between: 'Between',
  is: 'Is',
  isNot: 'Is Not',
  in: 'In',
  notIn: 'Not In',
};

// ============================================
// OPERATORS BY FIELD TYPE - Maps field types to their allowed operators
// ============================================
export const OPERATORS_BY_TYPE: Record<FieldType, FilterOperator[]> = {
  text: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  number: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  date: ['between'],
  amount: ['between'],
  singleSelect: ['is', 'isNot'],
  multiSelect: ['in', 'notIn'],
  boolean: ['is'],
};

// ============================================
// FILTER VALUE - Different value types based on operator
// ============================================
export interface RangeValue {
  min: string | number | null;
  max: string | number | null;
}

export interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
}

export type FilterValue = string | number | boolean | string[] | RangeValue | DateRangeValue | null;

// ============================================
// FIELD DEFINITION - Describes a filterable field
// ============================================
export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldDefinition {
  key: string;                    // The field key (can use dot notation for nested fields like 'address.city')
  label: string;                  // Display label for the field
  type: FieldType;                // The data type of the field
  options?: SelectOption[];       // Options for single/multi select fields
}

// ============================================
// FILTER CONDITION - A single filter rule
// ============================================
export interface FilterCondition {
  id: string;                     // Unique identifier for this filter
  field: string;                  // The field key to filter on
  operator: FilterOperator;       // The operator to use
  value: FilterValue;             // The filter value
}

// ============================================
// EMPLOYEE DATA STRUCTURE - The data we'll be filtering
// ============================================
export interface Address {
  city: string;
  state: string;
  country: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
  skills: string[];
  address: Address;
  projects: number;
  lastReview: string;
  performanceRating: number;
}

// ============================================
// TABLE SORTING - For sortable table columns
// ============================================
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}
