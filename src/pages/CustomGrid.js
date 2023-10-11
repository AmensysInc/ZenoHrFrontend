import React, { useState, useEffect } from "react";

export default function CustomGrid({ data, columns, customColumns }) {

  return (
    <table className="table border shadow">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.field}>{column.label}</th>
          ))}
          {customColumns.map((customColumn) => (
            <th key={customColumn.label}>{customColumn.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.field}>{item[column.field]}</td>
            ))}
            {customColumns.map((customColumn) => (
              <td key={customColumn.label}>{customColumn.render(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    
  );
}
