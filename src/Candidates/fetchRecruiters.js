import axios from "axios";

const fetchRecruiters = async () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  try {
    const token = localStorage.getItem("token");
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const recruitersResponse = await axios.get(
      `${apiUrl}/employees/role?securityGroup=RECRUITER`, // Adjust the API endpoint as needed
      requestOptions
    );

    if (recruitersResponse.status === 200) {
      const recruiterData = recruitersResponse.data || [];
      console.log(recruiterData);
      return recruiterData;
    } else {
      console.error("Error fetching recruiters:", recruitersResponse.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return [];
  }
};

export default fetchRecruiters;
