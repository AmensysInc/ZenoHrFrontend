import { get, post, put, remove } from "../httpClient ";


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
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      };
  
      const response = await post(`/employees`, employee, requestOptions);
  
      if (response.status === 200 || response.status === 201) {
        return true;
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
    return false;
  }
  
  export async function updateEmployee(employeeId, employee) {
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
      };
  
      const response = await put(`/employees/${employeeId}`, employee, requestOptions);
  
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
    return false;
  }
  
  export async function sendLoginDetails(emailID) {
    try {
      const response = await post(`/auth/resetPassword`, {
        email: emailID,
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
  
