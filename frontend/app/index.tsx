import {Redirect} from "expo-router";

import {useAuth} from "@/contexts/AuthContext";

export default function Index(): React.ReactElement | null {
  const {isLoggedIn, isLoading, user} = useAuth();

  if (isLoading) return null;

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return <Redirect href={user?.admin ? "/admin" : "/user"} />;
}
