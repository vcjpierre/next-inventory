import {
  AppShell,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
  Text,
  Box,
} from "@mantine/core";
import Nav from "./Navbar";
import { useState } from "react";

const PageLayout = ({ children }: any) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? "var(--bg)"
              : "var(--bg)",
          minHeight: "100vh",
        },
      }}
      navbarOffsetBreakpoint='sm'
      navbar={<Nav opened={opened} hiddenBreakpoint='sm' />}
      header={
        <Header
          height={56}
          p='md'
          sx={{
            background:
              theme.colorScheme === "dark"
                ? "var(--nav-bg)"
                : "var(--nav-bg)",
            borderBottom: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan='sm' styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size='sm'
                color={theme.colors.gray[6]}
                mr='xl'
              />
            </MediaQuery>

            <Text
              size='sm'
              color='dimmed'
              sx={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              _ / dashboard
            </Text>
          </div>
        </Header>
      }
    >
      <Box sx={{ padding: "1rem", "@media (min-width: 768px)": { padding: "2rem" } }}>{children}</Box>
    </AppShell>
  );
};

export default PageLayout;
