export const logoutUser = (setIsLoggedIn, setRole) => {
  localStorage.clear();
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

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      localStorage.setItem("tempPassword", tempPassword);

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
