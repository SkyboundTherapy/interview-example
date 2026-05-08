import {Box, Heading, Text} from "@terreno/ui";

import {useAuth} from "../contexts/AuthContext";

export const Profile: React.FC = () => {
  const {user} = useAuth();

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
      <Heading>My Profile</Heading>

      <Box>
        <Heading size="sm">Name:</Heading>
        <Text>{user?.name || "Not provided"}</Text>
      </Box>

      <Box>
        <Heading size="sm">Email:</Heading>
        <Text>{user?.email || "Not provided"}</Text>
      </Box>

      <Box>
        <Heading size="sm">Role:</Heading>
        <Text>{user?.admin ? "Admin" : "User"}</Text>
      </Box>
    </Box>
  );
};
