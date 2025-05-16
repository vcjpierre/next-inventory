import { getProviders, signIn, useSession } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import { Center, Button, Title, Stack, Text, Group, Alert } from "@mantine/core";
import { CustomNextPage } from "../../types/CustomNextPage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Signin: CustomNextPage = ({ providers }: any) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Si hay un error en la URL, mostrarlo
    if (router.query.error) {
      setError(router.query.error as string);
    }
    
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (status === "authenticated") {
      router.push("/");
    }
  }, [router, status]);
  
  return (
    <>
      {Object?.values(providers).map((provider: any) => {
        return (
          <Center key={provider.name} sx={{ width: "100vw", height: "100vh" }}>
            <Stack spacing='xl' sx={{ maxWidth: "400px", width: "100%" }}>
              <Title align='center'>Welcome to Invetory App ✋</Title>
              
              {error && (
                <Alert color="red" title="Error de autenticación">
                  {error === "Callback" ? "Error en la autenticación de Google. Por favor intente de nuevo." : error}
                </Alert>
              )}
              
              {provider.name === "Google" && (
                <Button
                  onClick={() => signIn(provider.id, { callbackUrl: window.location.origin })}
                  size={"lg"}
                  sx={{ alignSelf: "center" }}
                >
                  <Group>
                    <Text size='md'>Sign in with {provider.name}</Text>
                    <FaGoogle />
                  </Group>
                </Button>
              )}
            </Stack>
          </Center>
        );
      })}
    </>
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
