import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "./authUtils";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const error = await loginUser(email, password, onLogin, navigate);
    if (error) {
      setErrorMessage(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="login-page" style={styles.page}>
      <div className="login-container" style={styles.container}>
        <div className="login-header" style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to your Zeno Pay & HR account</p>
        </div>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group" style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          
          <div style={styles.forgotPassword}>
            <Link to="/forgot-password" style={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>
          
          {errorMessage && (
            <div className="alert alert-danger" style={styles.error}>
              {errorMessage}
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary"
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Logging in...</span>
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
        
        {/* <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.signupLink}>
              Sign up
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  container: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    color: "#2d3748",
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#718096",
    fontSize: "14px",
    margin: "0",
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#4a5568",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#667eea",
    outline: "none",
  },
  forgotPassword: {
    textAlign: "right",
    marginBottom: "20px",
  },
  forgotLink: {
    color: "#667eea",
    fontSize: "13px",
    textDecoration: "none",
  },
  error: {
    marginBottom: "20px",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#667eea",
    border: "none",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#5a67d8",
  },
  footer: {
    textAlign: "center",
    paddingTop: "20px",
    borderTop: "1px solid #edf2f7",
  },
  footerText: {
    color: "#718096",
    fontSize: "14px",
    margin: "0",
  },
  signupLink: {
    color: "#667eea",
    fontWeight: "600",
    textDecoration: "none",
  },
};