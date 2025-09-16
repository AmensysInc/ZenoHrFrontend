import { get, post, put, remove } from "../httpClient ";

export async function fetchEmployees() {
  try {
    const response = await get(`/contacts`);
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
    const recruiterId = sessionStorage.getItem("id");
    const queryParams = `?recruiterId=${recruiterId}`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Send employee as object, not as array
    const response = await post(`/bulkmails${queryParams}`, employee, requestOptions);

    if (response.status === 200 || response.status === 201) {
      return true;
    }
  } catch (error) {
    console.error("Error adding employee:", error);
  }
  return false;
}


export async function updateEmployee(id, employee) {
  try {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await put(`/contacts/${id}`, employee, requestOptions);

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
    const response = await get(`/contacts/${employeeId}`);

    if (response.status === 200) {
      const employeeData = await response.data;
      return employeeData;
    }
  } catch (error) {
    console.error("Error fetching employee data:", error);
  }
  return null;
}
