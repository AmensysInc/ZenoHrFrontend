import React, { useState } from "react";
import { Card, Table, Typography, Input, Button } from "antd";
import "./ReusableTable.css";

const { Title } = Typography;
const { Search } = Input;

export default function ReusableTable({
  title,
  columns,
  data,
  loading,
  total,
  onChange,
  pagination = true,
  extraHeader,
  rowClassName,
  tableProps = {},
  cardStyle = {},

  // 🔹 NEW OPTIONAL CALLBACK for server-side column filtering
  onColumnFilter, // (filterKey, values) => void

  // 🔹 Optional global search (if you want later)
  showGlobalSearch = false,
  onGlobalSearch,
  globalSearchPlaceholder = "Search...",
}) {
  // Default zebra rows
  const defaultRowClass = (record, index) =>
    index % 2 === 0 ? "table-row-light" : "table-row-dark";

  // State for search text inside each column filter dropdown
  const [columnFilterSearch, setColumnFilterSearch] = useState({});

  const handleColumnSearchChange = (key, value) => {
    setColumnFilterSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Enhance columns: add custom filterDropdown where filterConfig is provided
  const enhancedColumns = (columns || []).map((col) => {
    if (!col.filterConfig) return col;

    const {
      options = [], // [{ text, value }]
      placeholder = "Search...",
      filterKey, // optional → defaults to dataIndex or key
      multiple = true, // keep open for future multi-select use
    } = col.filterConfig;

    const key = filterKey || col.dataIndex || col.key;

    return {
      ...col,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => {
        const searchValue = columnFilterSearch[key] || "";
        const filteredOptions = options.filter((opt) =>
          (opt.text || opt.value || "")
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );

        const handleOptionToggle = (value) => {
          if (multiple) {
            const exists = selectedKeys.includes(value);
            const next = exists
              ? selectedKeys.filter((v) => v !== value)
              : [...selectedKeys, value];
            setSelectedKeys(next);
          } else {
            setSelectedKeys([value]);
          }
        };

        const applyFilter = () => {
          if (onColumnFilter) {
            onColumnFilter(key, selectedKeys);
          }
          confirm({ closeDropdown: true });
        };

        const clearFilter = () => {
          setSelectedKeys([]);
          if (onColumnFilter) {
            onColumnFilter(key, []);
          }
          clearFilters?.();
          confirm({ closeDropdown: true });
        };

        const cancelFilter = () => {
          // Just close without applying
          close?.();
        };

        return (
          <div className="column-filter-dropdown">
            <Input
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) =>
                handleColumnSearchChange(key, e.target.value || "")
              }
              className="column-filter-search"
              allowClear
            />

            <div className="column-filter-options">
              {filteredOptions.length === 0 ? (
                <div className="column-filter-empty">No options</div>
              ) : (
                filteredOptions.map((opt) => {
                  const value = opt.value ?? opt.text;
                  const isSelected = selectedKeys.includes(value);
                  return (
                    <div
                      key={value}
                      className={`column-filter-option ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => handleOptionToggle(value)}
                    >
                      <span className="bullet" />
                      <span>{opt.text ?? opt.value}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="column-filter-actions">
              <Button size="small" onClick={cancelFilter}>
                Cancel
              </Button>
              <Button size="small" onClick={clearFilter}>
                Clear
              </Button>
              <Button
                type="primary"
                size="small"
                onClick={applyFilter}
                disabled={!selectedKeys || selectedKeys.length === 0}
              >
                Apply
              </Button>
            </div>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <span className={`column-filter-icon ${filtered ? "active" : ""}`}>
          ▼
        </span>
      ),
      // ⚠️ IMPORTANT: no onFilter here → backend / parent handles it
      onFilter: undefined,
    };
  });

  const handleTableChange = (paginationInfo, filters, sorter, extra) => {
    // Keep existing onChange behavior for pages using it
    if (onChange) {
      onChange(paginationInfo, filters, sorter, extra);
    }
  };

  const handleGlobalSearch = (value) => {
    if (onGlobalSearch) {
      onGlobalSearch(value);
    }
  };

  return (
    <Card className="reusable-card" style={{ ...cardStyle }}>
      {title && (
        <Title level={4} className="reusable-title">
          {title}
        </Title>
      )}

      {/* Optional global search bar (top-right or top-left later if needed) */}
      {showGlobalSearch && (
        <div className="reusable-global-search-wrapper">
          <Search
            placeholder={globalSearchPlaceholder}
            onSearch={handleGlobalSearch}
            allowClear
            className="reusable-global-search"
          />
        </div>
      )}

      {extraHeader}

      <Table
        className="common-table-header"
        columns={enhancedColumns}
        dataSource={data}
        loading={loading}
        onChange={handleTableChange}
        pagination={
          pagination
            ? {
                total,
                showSizeChanger: true,
              }
            : false
        }
        bordered
        rowClassName={rowClassName || defaultRowClass}
        {...tableProps}
      />
    </Card>
  );
}
