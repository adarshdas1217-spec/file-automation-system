import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("AUTH CONTEXT LOADED");

  let parsedUser = null;

  try {
    const rawUser = localStorage.getItem("user");
    console.log("RAW USER FROM STORAGE:", rawUser);

    if (rawUser && rawUser !== "undefined") {
      parsedUser = JSON.parse(rawUser);
    }
  } catch (err) {
    console.error("FAILED TO PARSE USER FROM STORAGE", err);
    localStorage.removeItem("user");
  }

  const [user, setUser] = useState(parsedUser);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
