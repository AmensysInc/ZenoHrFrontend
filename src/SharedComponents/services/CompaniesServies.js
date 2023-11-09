import { get } from "../httpClient ";


export async function fetchCompanies() {
    try {
      const response = await get("/companies");
  
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        return data;
      } else {
        console.error("Error fetching companies:", response.status);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
    return [];
  }


  

