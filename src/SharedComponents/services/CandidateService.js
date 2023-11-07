import { get, post, put, remove } from "../httpClient ";


export async function fetchCandidates(currentPage, pageSize, searchQuery, searchField) {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("size", pageSize);  
    if (searchQuery) {
      searchParams.append("searchField", searchField);
      searchParams.append("searchString", searchQuery);
    }
    const response = await get(`/candidates?${searchParams.toString()}`);
    if (response.status === 200) {
      const data = response.data;
      const { content, totalPages } = data;
      return { content, totalPages }; 
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  return { content: [], totalPages: 0 };
}

export async function fetchCandidatesWithMarketing(currentPage, pageSize, searchQuery, searchField) {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("page", currentPage);
      searchParams.append("size", pageSize);  
      if (searchQuery) {
        searchParams.append("searchField", searchField);
        searchParams.append("searchString", searchQuery);
      }
      const response = await get(`/candidates/inMarketing?${searchParams.toString()}`);
      if (response.status === 200) {
        const data = response.data;
        const { content, totalPages } = data;
        return { content, totalPages }; 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return { content: [], totalPages: 0 };
  }

export async function deleteCandidate(candidateID) {
    try {
      const url = `/candidates/${candidateID}`;
      const response = await remove(url);
      if (response.status === 200) {
        return true;
      } else {
        console.error("Error deleting candidate:", response.status);
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
    return false;
  }

  export async function fetchCandidateById(candidateID) {
    try {  
      const response = await get(`/candidates/${candidateID}`);
  
      if (response.status === 200) {
        const candidateData = await response.data;
        return candidateData;
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
    return null;
  }
  

  export async function createCandidate(candidate) {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidate),
      };
  
      const response = await post(`/candidates`, candidate, requestOptions);
  
      if (response.status === 200 || response.status === 201) {
        return true;
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
    return false;
  }
  
  export async function updateCandidates(candidateID, candidate) {
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidate),
      };
  
      const response = await put(`/candidates/${candidateID}`, candidate, requestOptions);
  
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
    return false;
  }

  export async function fetchRecruiters() {
    try {
      const recruitersResponse = await get(`/employees/role?securityGroup=RECRUITER`);
  
      if (recruitersResponse.status === 200) {
        const recruiterData = recruitersResponse.data || [];
        return recruiterData;
      } else {
        console.error("Error fetching recruiters:", recruitersResponse.statusText);
      }
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
    return [];
  }