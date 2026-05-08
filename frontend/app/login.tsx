import {Box, Heading, Text as TerrenoText, useToast} from "@terreno/ui";
import {Redirect} from "expo-router";
import React, {useCallback, useState} from "react";
import {Text, TextInput, TouchableOpacity} from "react-native";

import {useAuth} from "@/contexts/AuthContext";

const LOGIN_PROMPT = "Please log in to continue.";
const TEST_CREDENTIALS =
  "Test credentials: admin@example.com, user@example.com (password: password)";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {login} = useAuth();
  const toast = useToast();

  const {isLoggedIn, user} = useAuth();

  const handleLogin = useCallback(async (): Promise<void> => {
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, toast, login]);

  if (isLoggedIn && user) {
    return <Redirect href={user.admin ? "/admin" : "/user"} />;
  }

  return (
    <Box flex="grow" justifyContent="center" padding={5}>
      <Box alignSelf="center" maxWidth={400} width="100%">
        <Heading>Login</Heading>

        <TerrenoText>{LOGIN_PROMPT}</TerrenoText>

        <Box marginBottom={5}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
              color: "#333",
            }}
          >
            Email
          </Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            keyboardType="email-address"
            placeholder="Enter your email"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: "#fff",
            }}
            value={email}
            onChangeText={setEmail}
          />
        </Box>

        <Box marginBottom={5}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
              color: "#333",
            }}
          >
            Password
          </Text>
          <TextInput
            editable={!isLoading}
            placeholder="Enter your password"
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: "#fff",
            }}
            value={password}
            onChangeText={setPassword}
          />
        </Box>

        <TouchableOpacity
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? "#ccc" : "#007AFF",
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={handleLogin}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TerrenoText>{TEST_CREDENTIALS}</TerrenoText>
      </Box>
    </Box>
  );
};

export default LoginScreen;
