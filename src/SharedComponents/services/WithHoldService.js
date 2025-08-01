import { get, post, put } from "../httpClient ";
import axios from "axios";

export const getTrackingForEmployee = async (employeeId, currentPage, pageSize, searchQuery, searchField) => {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);
    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }
    const ordersResponse = await get(`/employees/${employeeId}/trackings?${searchParams.toString()}`);
    return ordersResponse.data;
  };
  
  export const getEmployeeDetails = async (employeeId) => {
    const detailsResponse = await get(`/employees/${employeeId}`);
    return detailsResponse.data;
  };

  export const fetchEmployeeDetails = async (employeeId) => {
    try {
      const response = await get(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const fetchProjectNames = async (employeeId) => {
    try {
      const response = await get(`/employees/${employeeId}/projects`);
      return response.data.content || [];
    } catch (error) {
      throw error;
    }
  };

  export const fetchTrackingDetails = async (trackingId) => {
    try {
      const orderResponse = await get(`/trackings/${trackingId}`);
      return orderResponse.data;
    } catch (error) {
      console.error("Error fetching order data:", error);
      throw error;
    }
  };

  export const createTracking = async (employeeId, tracking) => {
    try {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tracking),
      };
  
      const response = await post(`/employees/${employeeId}/trackings`, tracking, requestOptions);
  
      if (response.status === 200 || response.status === 201) {
        return true;
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
    return false;
  };

  export const updateTracking = async (trackingId, tracking) => {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tracking),
    };
    try {
      const response = await put(`/employees/trackings/${trackingId}`, tracking, requestOptions);
      return response;
    } catch (error) {
      console.error("Error updating orders:", error);
      throw error;
    }
  };

  export const resetPassword = async (request) => {
  const token = sessionStorage.getItem("token");
  const response = await post(
    "/auth/resetPassword",
    request,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};