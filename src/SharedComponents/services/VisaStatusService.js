import { get } from "../httpClient ";

export async function getVisaStatusOptions() {
  try {
    const response = await get('/visa-status/options');
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching visa status options:", error);
  }
  return [];
}

