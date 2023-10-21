export const logoutUser = (setIsLoggedIn, setRole) => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole("");
    window.location.href = "/login";
  };
  