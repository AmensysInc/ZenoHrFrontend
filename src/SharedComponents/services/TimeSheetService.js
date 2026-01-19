import { get, post, put } from "../httpClient ";

export const getTimeSheetStatus = async () => {
    const response = await get('/timeSheets/getAllStatus');
    console.log(Array.isArray(response.data));
    return response.data;
};

export async function downloadTimesheetTemplate(templateType = 'weekly') {
  try {
    const response = await get(`/timeSheets/templates/download?templateType=${templateType}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `timesheet_${templateType}_template.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading template:", error);
    throw error;
  }
}

export async function getAvailableTemplates() {
  try {
    const response = await get('/timeSheets/templates/list');
    return response.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}