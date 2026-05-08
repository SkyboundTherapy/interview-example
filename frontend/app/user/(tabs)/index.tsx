import {Box, Button, Heading, Text} from "@terreno/ui";
import React, {useCallback} from "react";

import {useAuth} from "@/contexts/AuthContext";

const UserDashboard: React.FC = () => {
  const {user, logout} = useAuth();

  const handleLogout = useCallback(async (): Promise<void> => {
    await logout();
  }, [logout]);

  return (
    <Box
      alignSelf="center"
      color="base"
      flex="grow"
      gap={4}
      margin={4}
      padding={4}
      rounding="lg"
      scroll
      width={800}
    >
      <Heading>Welcome, {user?.name || "user"}</Heading>
      <Text>You are logged in.</Text>

      <Box alignItems="center" marginTop={5}>
        <Button text="Logout" variant="destructive" onClick={handleLogout} />
      </Box>
    </Box>
  );
};

export default UserDashboard;
