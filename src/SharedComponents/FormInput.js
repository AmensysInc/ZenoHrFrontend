import React from "react";
import { DatePicker } from "antd";

export default function FormInput({
  label,
  type,
  name,
  value,
  onChange,
  required = false,
  placeholder = "",
  selectOptions = null,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {type === "select" ? (
        <select
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {selectOptions &&
            selectOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      ) : type === "date" ? (
        <DatePicker
          type={type}
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className="form-control"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
