import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

function FormComponent({
  formFields,
  formState,
  onFormChange,
  onDateChange,
  onSubmit,
  isEditMode,
}) {
  return (
    <form onSubmit={onSubmit}>
      {formFields.map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === "date" ? (
            <DatePicker
              className="form-control"
              name={field.name}
              value={dayjs(formState[field.name])}
              onChange={(date) => onDateChange(date, field.name)}
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              className="form-control"
              name={field.name}
              value={formState[field.name]}
              onChange={onFormChange}
              required={field.required}
            />
          )}
        </div>
      ))}
      <button type="submit" className="btn btn-outline-primary">
        {isEditMode ? "Update" : "Submit"}
      </button>
    </form>
  );
}

export default FormComponent;
