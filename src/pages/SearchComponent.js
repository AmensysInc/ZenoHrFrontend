import React from "react";
import { Select, Input, Button } from "antd";

export default function SearchComponent({
  searchField,
  setSearchField,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleClearSearch,
}) {
  return (
    <div className="search-container">
      <div className="search-bar">
        <Select
          value={searchField}
          onChange={(value) => setSearchField(value)}
          style={{ width: 120 }}
        >
          <Select.Option value="">Select Field</Select.Option>
          <Select.Option value="firstName">First Name</Select.Option>
          <Select.Option value="lastName">Last Name</Select.Option>
          <Select.Option value="emailID">Email Id</Select.Option>
          <Select.Option value="phoneNo">Phone No</Select.Option>
          <Select.Option value="onBench">Working Status</Select.Option>
        </Select>
        <Input.Search
          placeholder="Search..."
          onSearch={handleSearch}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          enterButton
        />
      </div>
      <Button onClick={handleClearSearch}>Clear</Button>
    </div>
  );
}
