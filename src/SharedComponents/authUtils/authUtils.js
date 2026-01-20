export const logoutUser = (setIsLoggedIn, setRole, navigate) => {
  sessionStorage.clear();
  setIsLoggedIn(false);
  setRole("");
  navigate("/login", { replace: true });
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
    }

    const data = await response.json();
    const { role, access_token, firstName, lastName, id, tempPassword } = data;

    sessionStorage.setItem("token", access_token);
    sessionStorage.setItem("firstName", firstName);
    sessionStorage.setItem("lastName", lastName);
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("id", id);
    sessionStorage.setItem("tempPassword", tempPassword);

    // ✅ Fetch user-company roles using userId
    const userId = id;
    try {
      const companyResponse = await fetch(`${apiUrl}/user-company/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (companyResponse.ok) {
        const companies = await companyResponse.json();
        const defaultCompany = companies.find((item) => item.defaultCompany === "true");

        if (defaultCompany) {
          // Only set defaultCompanyId for roles that need it (not SADMIN)
          if (role !== "SADMIN") {
            sessionStorage.setItem("defaultCompanyId", defaultCompany.companyId);
          }
        } else if (role === "ADMIN") {
          // ADMIN must have a default company
          return "No default company assigned. Please contact super admin.";
        } else if (role !== "SADMIN" && role !== "EMPLOYEE" && role !== "PROSPECT" && role !== "HR_MANAGER") {
          return "No default company assigned. Please contact admin.";
        }
      } else {
        // For SADMIN, no company is needed - allow login
        if (role === "SADMIN") {
          console.log("SADMIN login - no company assignment needed");
        } else if (role === "EMPLOYEE" || role === "PROSPECT" || role === "HR_MANAGER") {
          // For EMPLOYEE, PROSPECT, and HR_MANAGER roles, allow login even if user-company fetch fails
          // They might have a company assigned in Employee table but no UserCompanyRole yet
          console.warn("Could not fetch user-company roles, but allowing login for", role);
          // Don't return error - allow them to login
        } else if (role === "ADMIN") {
          // ADMIN must have a company assignment
          return "No default company assigned. Please contact super admin.";
        } else {
          // For other roles, require company assignment
          return "No default company assigned. Please contact admin.";
        }
      }
    } catch (error) {
      // If fetch fails completely, still allow EMPLOYEE, PROSPECT, HR_MANAGER, and SADMIN to login
      if (role === "EMPLOYEE" || role === "PROSPECT" || role === "HR_MANAGER" || role === "SADMIN") {
        console.warn("Error fetching user-company roles, but allowing login for", role, error);
      } else {
        console.error("Error fetching user-company roles:", error);
        return "Could not verify company assignment. Please contact admin.";
      }
    }
    // Set login state first, then navigate
    onLogin(role);
    
    // Use setTimeout to ensure state is updated before navigation
    if (tempPassword === true) {
      setTimeout(() => {
        navigate(`/change-password/${id}`, { replace: true });
      }, 100);
    } else {
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
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
