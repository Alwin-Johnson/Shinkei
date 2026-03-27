import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedItems: T[]) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  className?: string;
  emptyMessage?: string;
  hoverable?: boolean;
}

type SortConfig = {
  column: string;
  direction: 'asc' | 'desc';
} | null;

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onSelectionChange,
  onSort,
  className = '',
  emptyMessage = 'No data available',
  hoverable = true
}: TableProps<T>) => {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Handle individual row selection
  const handleRowSelect = (item: T, isSelected: boolean) => {
    let newSelection: T[];
    
    if (isSelected) {
      newSelection = [...selectedItems, item];
    } else {
      newSelection = selectedItems.filter(selected => selected !== item);
    }
    
    setSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    const newSelection = isSelected ? [...data] : [];
    setSelectedItems(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Handle column sorting
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    const columnKey = column.key as string;
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig?.column === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ column: columnKey, direction });
    onSort?.(columnKey, direction);
  };

  // Get cell value
  const getCellValue = (row: T, column: TableColumn<T>) => {
    const value = row[column.key as keyof T];
    return column.render ? column.render(value, row, data.indexOf(row)) : value;
  };

  // Check if row is selected
  const isRowSelected = (item: T) => {
    return selectedItems.includes(item);
  };

  // Check if all rows are selected
  const isAllSelected = data.length > 0 && selectedItems.length === data.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left w-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                </th>
              )}
              
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${
                            sortConfig?.column === column.key && sortConfig.direction === 'asc'
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${
                            sortConfig?.column === column.key && sortConfig.direction === 'desc'
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {selectable && (
                    <td className="px-4 py-4">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  )}
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`${
                    hoverable ? 'hover:bg-gray-50' : ''
                  } ${isRowSelected(row) ? 'bg-blue-50' : ''} transition-colors duration-150`}
                >
                  {selectable && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isRowSelected(row)}
                        onChange={(e) => handleRowSelect(row, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </td>
                  )}
                  
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`px-4 py-4 text-sm text-gray-900 ${
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer - Selection Count */}
      {selectable && selectedItems.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedItems.length} of {data.length} items selected
            </span>
            <button
              onClick={() => handleSelectAll(false)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;