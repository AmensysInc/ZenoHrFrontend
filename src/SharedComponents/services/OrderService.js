import { get, post, put } from "../httpClient ";


export const getOrdersForEmployee = async (employeeId, currentPage, pageSize, searchQuery, searchField) => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", currentPage);
  searchParams.append("size", pageSize);
  if (searchQuery) {
    searchParams.append("searchField", searchField);
    searchParams.append("searchString", searchQuery);
  }
  const ordersResponse = await get(`/employees/${employeeId}/orders?${searchParams.toString()}`);
  return ordersResponse.data;
};

export const getUserDetails = async (employeeId) => {
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

export const fetchOrderDetails = async (orderId) => {
  try {
    const orderResponse = await get(`/orders/${orderId}`);
    return orderResponse.data;
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw error;
  }
};

export const createOrder = async (employeeId, orders) => {
  try {
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orders),
    };

    const response = await post(`/employees/${employeeId}/orders`, orders, requestOptions);

    if (response.status === 200 || response.status === 201) {
      return true;
    }
  } catch (error) {
    console.error("Error adding employee:", error);
  }
  return false;
};

export const updateOrder = async (orderId, orders) => {
  const requestOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orders),
  };
  try {
    const response = await put(`/employees/orders/${orderId}`, orders, requestOptions);
    return response;
  } catch (error) {
    console.error("Error updating orders:", error);
    throw error;
  }
};