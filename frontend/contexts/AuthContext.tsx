import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {createContext, useCallback, useContext, useEffect, useState} from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  admin: boolean;
}

interface AuthData {
  token: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "@auth";

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserData = useCallback(async (userId: string, authToken: string): Promise<User> => {
    const response = await fetch(`http://localhost:9000/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const userData = await response.json();
    console.debug("Current logged in user:", userData?.data);
    return userData?.data;
  }, []);

  // Load saved auth state on app start
  useEffect(() => {
    const loadAuthState = async (): Promise<void> => {
      try {
        const savedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
          const authData: AuthData = JSON.parse(savedAuth);
          setToken(authData.token);

          // Fetch fresh user data
          const userData = await fetchUserData(authData.userId, authData.token);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
        // Clear invalid auth data
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, [fetchUserData]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:9000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Invalid email or password");
          }
          throw new Error(`Login failed: ${response.status}`);
        }

        const loginResponse = await response.json();
        console.info("Login response:", loginResponse);

        const authData: AuthData = loginResponse.data;
        const {token: authToken, userId} = authData;

        // Store token and fetch user data
        setToken(authToken);
        const userData = await fetchUserData(userId, authToken);
        setUser(userData);

        // Save auth data to storage
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserData]
  );

  const logout = useCallback(async (): Promise<void> => {
    console.info("Logging out");
    // Clear local state
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    console.info("Logged out successfully");
  }, []);

  const isLoggedIn = user !== null;
  console.info("isLoggedIn", isLoggedIn, user, token);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
