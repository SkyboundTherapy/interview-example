import {Box, Heading, Text} from "@terreno/ui";
import {Link, Stack} from "expo-router";
import React from "react";

export default function NotFoundScreen(): React.ReactNode {
  return (
    <>
      <Stack.Screen options={{title: "Oops!"}} />
      <Box alignItems="center" height="100%" justifyContent="center" width="100%">
        <Heading>This screen does not exist.</Heading>
        <Box marginTop={4} style={{paddingVertical: 15}}>
          <Link href="/">
            <Text>Go to home screen!</Text>
          </Link>
        </Box>
      </Box>
    </>
  );
}
