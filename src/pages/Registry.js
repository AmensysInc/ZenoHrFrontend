import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function Registry() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleRegistry = async () => {
        try {
          const response = await fetch("/registry", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
          });
          const data = await response.json();
          // Handle the response from the backend
          // e.g. show a success message or handle errors
          // Redirect to another page if registration is successful
          history.push("/login");
        } catch (error) {
          console.error("Error:", error);
        }
      };

      return (
        <div>
          <h2>Registry</h2>
          <form>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={handleRegistry}>
              Register
            </button>
          </form>
        </div>
      );
    }
    export default Registry;