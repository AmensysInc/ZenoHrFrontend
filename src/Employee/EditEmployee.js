import React from "react";
import EmployeeForm from "./EmployeeForm";
import Buttons from "./Buttons";

export default function EditEmployee() {

  return (
    <div>
      <Buttons/>
      <EmployeeForm mode="edit" />
    </div>
  );
}
