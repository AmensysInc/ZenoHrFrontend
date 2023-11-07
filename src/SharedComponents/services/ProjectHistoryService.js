import { get, post, put } from "../httpClient ";

export const getProjectsForEmployee = async (employeeId, currentPage, pageSize, searchQuery, searchField) => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);
    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }
    const ordersResponse = await get(`/employees/${employeeId}/projects?${searchParams.toString()}`);
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

  export const fetchProjectDetails = async (projectId) => {
    try {
      const response = await get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order data:", error);
      throw error;
    }
  };

  export const createProject = async (employeeId, project) => {
    try {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      };
  
      const response = await post(`/employees/${employeeId}/projects`, project, requestOptions);
  
      if (response.status === 200 || response.status === 201) {
        return true;
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
    return false;
  };

  export const updateProject = async (projectId, project) => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    };
    try {
      const response = await put(`/employees/projects/${projectId}`, project, requestOptions);
      return response;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

