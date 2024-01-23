export const logoutUser = (setIsLoggedIn, setRole) => {
  sessionStorage.clear();
  setIsLoggedIn(false);
  setRole("");
  window.location.href = "/login";
};

export const loginUser = async (email, password, onLogin, navigate) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  try {
    const response = await fetch(`${apiUrl}/auth/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 403) {
      return "Invalid Credentials!";
    } else {
      const data = await response.json();
      const { role, access_token, id, tempPassword } = data;

      sessionStorage.setItem("token", access_token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("id", id);
      sessionStorage.setItem("tempPassword", tempPassword);

      if (tempPassword === true) {
        console.log("Role:", role);
        console.log("Temporary Password:", tempPassword);
        onLogin(role);
        navigate(`/change-password/${id}`);
      } else {
        onLogin(role);
        navigate("/");
      }
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return "An error occurred while logging in.";
  }
};

export const updatePassword = async (userId, password) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL;
    const queryParams = new URLSearchParams();
    queryParams.append("userId", userId);
    queryParams.append("password", password);

    const url = `${apiUrl}/auth/updatePassword?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Failed to update password.");
  }
};
