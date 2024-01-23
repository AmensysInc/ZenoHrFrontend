import { get, post, put } from "../httpClient ";

export const getTimeSheetStatus = async () => {
    const response = await get('/timeSheets/getAllStatus');
    console.log(Array.isArray(response.data));
    return response.data;
};