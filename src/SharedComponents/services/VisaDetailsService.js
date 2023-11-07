import { get, post, put } from "../httpClient ";

export const getVisaForEmployee = async (employeeId, currentPage, pageSize, searchQuery, searchField) => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);
    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }
    const ordersResponse = await get(`/employees/${employeeId}/visa-details?${searchParams.toString()}`);
    return ordersResponse.data;
  };
  
  export const getEmployeeDetails = async (employeeId) => {
    const detailsResponse = await get(`/employees/${employeeId}`);
    return detailsResponse.data;
  };

  export const fetchEmployeeDetails = async (employeeId) => {
    try {
  
      const employeeResponse = await get(`/employees/${employeeId}`);
      return employeeResponse.data;
      
    } catch (error) {
      console.error("Error fetching employee data:", error);
      throw error;
    }
  };

  export const fetchVisaDetails = async (visaId) => {
    try {
      const response = await get(`/visa-details/${visaId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order data:", error);
      throw error;
    }
  };

  export const createVisa = async (employeeId, details) => {
    try {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      };
  
      const response = await post(`/employees/${employeeId}/visa-details`, details, requestOptions);
  
      if (response.status === 200 || response.status === 201) {
        return true;
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
    return false;
  };

  export const updateVisa = async (visaId, details) => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    };
    try {
      const response = await put(`/employees/visa-details/${visaId}`, details, requestOptions);
      return response;
    } catch (error) {
      console.error("Error updating visa:", error);
      throw error;
    }
  };