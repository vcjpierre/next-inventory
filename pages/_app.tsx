import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useState } from "react";
import AuthGuard from "../components/AuthGuard";
import { NextComponentType } from "next/types";
import PageLayout from "../components/PageLayout";

export type CustomAppProps = AppProps & {
  Component: NextComponentType & { requireAuth?: boolean };
};

export const queryClient = new QueryClient();

const theme = {
  fontFamily: "Inter, sans-serif",
  fontFamilyMonospace: "JetBrains Mono, monospace",
  headings: {
    fontFamily: "Archivo, sans-serif",
    fontWeight: 700 as const,
  },
  defaultRadius: "md" as const,
  colors: {
    brand: [
      "#e8f0fe",
      "#c2d6f8",
      "#9bbcf2",
      "#75a2ec",
      "#4e88e6",
      "#286ee0",
      "#2058b3",
      "#184286",
      "#102c59",
      "#08162d",
    ] as [string, string, string, string, string, string, string, string, string, string],
  },
  primaryColor: "brand",
  primaryShade: { light: 5, dark: 5 } as const,
  components: {
    Button: {
      defaultProps: {
        radius: "md" as const,
      },
    },
    Paper: {
      defaultProps: {
        radius: "md" as const,
      },
    },
    Modal: {
      defaultProps: {
        radius: "md" as const,
      },
    },
    Card: {
      defaultProps: {
        radius: "md" as const,
      },
    },
  },
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            ...theme,
            colorScheme: colorScheme,
          }}
        >
          <SessionProvider
            session={session}
            refetchInterval={5 * 60}
            refetchOnWindowFocus
          >
            {Component.requireAuth ? (
              <AuthGuard>
                <PageLayout>
                  <Component {...pageProps} />
                </PageLayout>
              </AuthGuard>
            ) : (
              <Component {...pageProps} />
            )}
            <ReactQueryDevtools position='bottom-right' />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}
