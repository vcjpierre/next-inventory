import { getProviders, signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import {
  Center,
  Button,
  Title,
  Stack,
  Text,
  Group,
  Alert,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { GoArchive } from "react-icons/go";
import { CustomNextPage } from "../../types/CustomNextPage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Signin: CustomNextPage = ({ providers }: any) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (router.query.error) {
      setError(router.query.error as string);
    }
    if (status === "authenticated") {
      router.push("/");
    }
  }, [router, status]);

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.colorScheme === "dark"
            ? "var(--bg)"
            : "var(--bg)",
        padding: "1rem",
      })}
    >
      {Object?.values(providers).map((provider: any) => (
          <Stack
            key={provider.name}
            spacing='xl'
            align='center'
            sx={{
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
            }}
          >
          <ThemeIcon
            variant='gradient'
            gradient={{ from: "brand.5", to: "brand.7" }}
            size={60}
            radius='sm'
            mx='auto'
          >
            <GoArchive size={28} />
          </ThemeIcon>

          <div>
            <Title
              order={1}
              sx={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 900,
                fontSize: "2rem",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              invetory
            </Title>
            <Text
              color='dimmed'
              size='sm'
              mt='xs'
              sx={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              stock management system
            </Text>
          </div>

          <Text color='dimmed' size='sm' sx={{ maxWidth: 300 }}>
            Track your inventory, manage products, and monitor stock levels in
            real time.
          </Text>

          {error && (
            <Alert color='red' title='Authentication error'>
              {error === "Callback"
                ? "Google authentication failed. Check server configuration and Google credentials."
                : error === "OAuthSignin"
                ? "Failed to start Google authentication. Please try again."
                : error === "OAuthCallback"
                ? "Callback process error. Verify redirect URLs."
                : error === "OAuthCreateAccount"
                ? "Failed to create account with Google."
                : error === "EmailCreateAccount"
                ? "Failed to create account with provided email."
                : error === "Verification"
                ? "Verification link expired or already used."
                : error === "AccessDenied"
                ? "Access denied. You don't have permission to sign in."
                : error === "Configuration"
                ? "Server configuration problem."
                : error}
            </Alert>
          )}

          {provider.name === "Google" && (
            <Button
              onClick={() => {
                signIn(provider.id, {
                  callbackUrl: `${window.location.origin}/`,
                  redirect: true,
                });
              }}
              size='lg'
              fullWidth
              leftIcon={<FaGoogle />}
              sx={{
                height: 48,
                fontFamily: "Archivo, sans-serif",
                fontWeight: 600,
              }}
            >
              Sign in with {provider.name}
            </Button>
          )}
        </Stack>
      ))}
    </Box>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

Signin.requireAuth = false;
export default Signin;
