import { get, post } from "../httpClient ";

export async function sendReminders(request) {
  try {
    const response = await post('/timesheets/reminders/send', request);
    return response.data;
  } catch (error) {
    console.error("Error sending reminders:", error);
    throw error;
  }
}

export async function getPendingTimesheets(month, year) {
  try {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    const response = await get(`/timesheets/reminders/pending?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending timesheets:", error);
    return { pendingTimesheets: [], pendingCount: 0 };
  }
}

