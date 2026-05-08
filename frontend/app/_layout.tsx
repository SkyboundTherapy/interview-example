import {TerrenoProvider} from "@terreno/ui";
import {Slot} from "expo-router";
import {StatusBar} from "expo-status-bar";
import React from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";

import {AuthProvider} from "@/contexts/AuthContext";

export default function RootLayout(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <TerrenoProvider>
        <AuthProvider>
          <Slot />
          <StatusBar style="auto" />
        </AuthProvider>
      </TerrenoProvider>
    </SafeAreaProvider>
  );
}
