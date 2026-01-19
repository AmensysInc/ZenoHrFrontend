import { get, post, put } from "../httpClient ";

export async function getAddressVerification(employeeId) {
  try {
    const response = await get(`/address-verification/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching address verification:", error);
    return null;
  }
}

export async function createOrUpdateAddressVerification(employeeId, data) {
  try {
    const response = await post(`/address-verification/${employeeId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error saving address verification:", error);
    throw error;
  }
}

export async function verifyHomeAddress(employeeId, verifiedBy) {
  try {
    const response = await post(
      `/address-verification/${employeeId}/verify-home?verifiedBy=${encodeURIComponent(verifiedBy)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying home address:", error);
    throw error;
  }
}

export async function verifyWorkAddress(employeeId, verifiedBy) {
  try {
    const response = await post(
      `/address-verification/${employeeId}/verify-work?verifiedBy=${encodeURIComponent(verifiedBy)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying work address:", error);
    throw error;
  }
}

export async function getAllAddressVerifications() {
  try {
    const response = await get('/address-verification/all');
    return response.data;
  } catch (error) {
    console.error("Error fetching all address verifications:", error);
    return [];
  }
}

