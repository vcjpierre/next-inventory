import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Loader, Center } from "@mantine/core";
import React from "react";
const AuthGuard = ({ children }: { children: React.ReactNode }): any => {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated")
      if (router.pathname !== "/auth/signin") router.push("/auth/signin");
  }, [status, data, router]);
  if (status === "loading")
    return (
      <Center sx={{ width: "100vw", height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  if (status === "authenticated") return children;
};

export default AuthGuard;
