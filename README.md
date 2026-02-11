# Dynamic Filter Component System

A reusable, type-safe dynamic filter component system built with React 18 and TypeScript. This system provides a flexible way to filter data tables with multiple field types and operators.

## Features

- **Dynamic Filter Builder**: Add multiple filter conditions with different field types
- **Multi-Type Support**: Text, Number, Date, Amount, Single Select, Multi-Select, Boolean fields
- **Smart Operators**: Context-appropriate operators based on field type
- **Real-time Filtering**: Instant table updates as filters change
- **Sortable Table**: Click column headers to sort data
- **Type-Safe**: Full TypeScript support throughout
- **Modular Design**: Reusable components that work independently

## Supported Field Types & Operators

| Field Type | Operators | Input Component |
|------------|-----------|-----------------|
| Text | Equals, Contains, Starts With, Ends With, Does Not Contain | Text input |
| Number | Equals, Greater Than, Less Than, ≥, ≤ | Number input |
| Date | Between (range) | Date range picker |
| Amount | Between (range) | Amount range input |
| Single Select | Is, Is Not | Dropdown |
| Multi-Select | In, Not In | Multi-select checkbox dropdown |
| Boolean | Is | Toggle switch |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Dynamic-Filter-Component-System

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── FilterBuilder/       # Main filter builder component
│   │   ├── FilterBuilder.tsx
│   │   ├── FilterRow.tsx
│   │   └── index.ts
│   ├── FilterInputs/        # Individual input components
│   │   ├── TextInput.tsx
│   │   ├── NumberInput.tsx
│   │   ├── DateRangeInput.tsx
│   │   ├── AmountRangeInput.tsx
│   │   ├── SingleSelectInput.tsx
│   │   ├── MultiSelectInput.tsx
│   │   ├── BooleanInput.tsx
│   │   └── index.ts
│   ├── DataTable/           # Sortable data table
│   │   ├── DataTable.tsx
│   │   └── index.ts
│   └── index.ts
├── data/
│   └── employeeData.ts      # Sample data (55 records)
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   └── filterUtils.ts       # Filtering algorithms
├── App.tsx                  # Main application
└── main.tsx                 # Entry point
```

## Component Usage

### FilterBuilder

The main component for building filter conditions:

```tsx
import { FilterBuilder } from './components/FilterBuilder';
import { FilterCondition, FieldDefinition } from './types';

const fields: FieldDefinition[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'salary', label: 'Salary', type: 'amount' },
  { 
    key: 'department', 
    label: 'Department', 
    type: 'singleSelect',
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Marketing', label: 'Marketing' },
    ]
  },
];

function App() {
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  return (
    <FilterBuilder
      filters={filters}
      fields={fields}
      onFiltersChange={setFilters}
    />
  );
}
```

### DataTable

Sortable table component for displaying filtered data:

```tsx
import { DataTable } from './components/DataTable';

<DataTable 
  data={filteredData} 
  totalRecords={allData.length} 
/>
```

### Filter Utils

Apply filters to your data:

```tsx
import { applyFilters } from './utils/filterUtils';

const filteredData = applyFilters(employeeData, filters);
```

## Filter Logic

- **AND Logic**: Between different fields (all must match)
- **OR Logic**: Within same field (any can match)
- **Case-insensitive**: Text matching is case-insensitive
- **Nested Fields**: Supports dot notation (e.g., `address.city`)

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material UI** - Component library
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Data Structure

The sample data uses this Employee interface:

```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
  skills: string[];
  address: {
    city: string;
    state: string;
    country: string;
  };
  projects: number;
  lastReview: string;
  performanceRating: number;
}
```

## License

MIT
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
