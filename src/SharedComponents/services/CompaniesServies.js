import { get, remove } from "../httpClient ";


export async function fetchCompanies(currentPage, pageSize, searchQuery, searchField, companyId) {
    try {
      const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);  
    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }
    // Add companyId filter for GROUP_ADMIN
    if (companyId) {
      searchParams.append("companyId", companyId);
    }
      const response = await get(`/companies?${searchParams.toString()}`);
  
      if (response.status === 200) {
        const data = response.data;
        const { content, totalPages } = data;
        console.log(data);
        return { content, totalPages }; 
      } else {
        console.error("Error fetching companies:", response.status);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    return  { content: [], totalPages: 0 };
  }

  export async function deleteCompanies(companyId) {
    try {
      const url = `/companies/${companyId}`;
      const response = await remove(url);
      if (response.status === 200) {
        return true;
      } else {
        console.error("Error deleting companies:", response.status);
      }
    } catch (error) {
      console.error("Error deleting companies:", error);
    }
    return false;
  }


  

