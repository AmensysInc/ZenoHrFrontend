import { get, post, put, remove } from "../httpClient ";

export async function fetchEmployees(currentPage, pageSize, searchQuery, searchField, companyId) {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);  
    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }
    // Add company_id filter for GROUP_ADMIN
    const role = sessionStorage.getItem("role")?.replace(/"/g, "");
    if (role === "GROUP_ADMIN") {
      const selectedCompanyId = sessionStorage.getItem("selectedCompanyId");
      if (selectedCompanyId) {
        searchParams.append("company_id", selectedCompanyId);
      }
    } else if (companyId) {
      // For other roles, use provided companyId if available
      searchParams.append("company_id", companyId);
    }
    const response = await get(`/employees?${searchParams.toString()}`);
    if (response.status === 200) {
      const data = response.data;
      const { content, totalPages } = data;
      return { content, totalPages }; 
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return { content: [], totalPages: 0 };
}

/*
export async function fetchEmployees(currentPage, pageSize, searchQuery, searchField) {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);  
    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }
    const response = await get(`/employees?${searchParams.toString()}`);
    if (response.status === 200) {
      const data = response.data;
      const { content, totalPages } = data;
      return { content, totalPages }; 
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return { content: [], totalPages: 0 };
}
*/


export async function deleteEmployee(employeeId) {
  try {
    const url = `/employees/${employeeId}`;
    const response = await remove(url);
    if (response.status === 200) {
      return true;
    } else {
      console.error("Error deleting employee:", response.status);
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
  return false;
}

export async function createEmployee(employee) {
  try {
    const employeeDTO = {
      employeeID: employee.employeeID || null,
      firstName: employee.firstName,
      middleName: employee.middleName || null,
      lastName: employee.lastName,
      emailID: employee.emailID,
      clgOfGrad: employee.clgOfGrad,
      phoneNo: employee.phoneNo,
      dob: employee.dob,
      onBench: employee.onBench,
      securityGroup: employee.securityGroup,
      companyId: Number(employee.companyId),
      password: employee.password,
      reportingManagerId: employee.reportingManagerId || null, // Added reportingManagerId
    };

    const response = await post(`/employees`, employeeDTO, {
      headers: { "Content-Type": "application/json" },
    });

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error adding employee:", error);
    return false;
  }
}

export async function updateEmployee(employeeId, employee) {
  try {
    const employeeDTO = {
      ...employee,
      companyId: Number(employee.companyId),
    };

    const response = await put(`/employees/${employeeId}`, employeeDTO, {
      headers: { "Content-Type": "application/json" },
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error updating employee:", error);
    return false;
  }
}

  
  export async function sendLoginDetails(emailID) {
    try {
      const response = await post(`/auth/resetPassword`, {
        email: emailID,
        category : "LOGIN_DETAILS"
      });
  
      if (response.status === 200 || response.status === 201) {
        return true;
      } else {
        console.error("Password reset request failed.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    return false;
  }

  export async function fetchEmployeeDataById(employeeId) {
    try {  
      const response = await get(`/employees/${employeeId}`);
  
      if (response.status === 200) {
        const employeeData = await response.data;
        return employeeData;
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
    return null;
  }
