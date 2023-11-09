import React, { useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function CustomGrid({ data, columns, customColumns }) {
  const gridOptions = {
    domLayout: "autoWidth",
    defaultColDef: {
      headerClass: "custom-header",
    },
  };

  const gridColumns = [
    ...columns.map((column) => ({
      headerName: column.label,
      field: column.field,
      resizable: true,
    })),
    ...customColumns.map((customColumn) => ({
      headerName: customColumn.label,
      cellRenderer: customColumn.render,
    })),
  ];  

  const gridRef = useRef();

  const onGridReady = useCallback((params) => {
    gridRef.current.api.sizeColumnsToFit();
  });

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        ref={gridRef}
        gridOptions={gridOptions}
        columnDefs={gridColumns}
        rowData={data}
        onGridReady={onGridReady}
      />
    </div>
  );
}
