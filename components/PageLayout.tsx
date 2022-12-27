import {
  AppShell,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import Nav from "./Navbar";
import { useState } from "react";
import { useSession } from "next-auth/react";

const PageLayout = ({ children }: any) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { status } = useSession();

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint='sm'
      navbar={<Nav opened={opened} hiddenBreakpoint='sm' />}
      header={
        <Header height={70} p='md'>
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

            <Text>Next Inventory</Text>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default PageLayout;
