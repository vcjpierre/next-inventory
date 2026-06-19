import {
  ActionIcon,
  Box,
  Navbar,
  ScrollArea,
  useMantineColorScheme,
  Title,
  MantineNumberSize,
  ThemeIcon,
  UnstyledButton,
  Group,
  Text,
  Avatar,
  useMantineTheme,
  Tooltip,
} from "@mantine/core";
import React from "react";
import Link from "next/link";
import { BiCategory } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { TbClipboardList } from "react-icons/tb";
import { AiOutlineHome } from "react-icons/ai";
import { ImSun, ImIcoMoon } from "react-icons/im";
import { GoArchive } from "react-icons/go";
import { FiSettings } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FiChevronRight } from "react-icons/fi";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  pageLink: string;
}

const getWordInitials = (word: string): string => {
  const bits = word.trim().split(" ");
  return bits
    .map((bit) => bit.charAt(0))
    .join("")
    .toUpperCase();
};

const MainLink = ({ icon, color, label, pageLink }: MainLinkProps) => {
  const router = useRouter();
  const isActive = router.pathname === pageLink;
  const theme = useMantineTheme();

  return (
    <Link href={pageLink} passHref>
      <UnstyledButton
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          padding: "10px 12px",
          borderRadius: theme.radius.sm,
          color: isActive
            ? theme.colorScheme === "dark"
              ? "#fff"
              : "#1a1b23"
            : theme.colorScheme === "dark"
            ? theme.colors.dark[1]
            : theme.colors.gray[6],
          backgroundColor: isActive
            ? theme.colorScheme === "dark"
              ? "rgba(59, 125, 216, 0.15)"
              : "rgba(59, 125, 216, 0.08)"
            : "transparent",
          fontWeight: isActive ? 600 : 400,
          transition: "all 150ms ease",
          "&:hover": {
            backgroundColor: isActive
              ? theme.colorScheme === "dark"
                ? "rgba(59, 125, 216, 0.2)"
                : "rgba(59, 125, 216, 0.12)"
              : theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          },
        })}
      >
        <ThemeIcon
          color={color}
          variant={isActive ? "filled" : "light"}
          size='sm'
          radius='sm'
        >
          {icon}
        </ThemeIcon>
        <Text size='sm'>{label}</Text>
      </UnstyledButton>
    </Link>
  );
};

const data: MainLinkProps[] = [
  {
    icon: <AiOutlineHome size={16} />,
    color: "brand",
    label: "Home",
    pageLink: "/",
  },
  {
    icon: <BiCategory size={16} />,
    color: "brand",
    label: "Categories",
    pageLink: "/categories",
  },
  {
    icon: <BsBox size={14} />,
    color: "brand",
    label: "Inventory",
    pageLink: "/inventory",
  },
  {
    icon: <TbClipboardList size={18} />,
    color: "brand",
    label: "Products",
    pageLink: "/products",
  },
  {
    icon: <FiSettings size={16} />,
    color: "brand",
    label: "Settings",
    pageLink: "/settings",
  },
];

const Brand = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingBottom: theme.spacing.lg,
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Group position='apart' align='center' noWrap>
        <Group noWrap spacing='sm'>
          <ThemeIcon
            variant='gradient'
            gradient={{ from: "brand.5", to: "brand.7" }}
            size='lg'
            radius='sm'
          >
            <GoArchive size={18} />
          </ThemeIcon>
          <div>
            <Title
              size={"1.1rem"}
              weight={900}
              sx={{
                fontFamily: "Archivo, sans-serif",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              invetory
            </Title>
            <Text
              size='xs'
              color='dimmed'
              sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px" }}
            >
              stock management
            </Text>
          </div>
        </Group>

        <Tooltip
          label={colorScheme === "dark" ? "Light mode" : "Dark mode"}
          position='right'
          withArrow
        >
          <ActionIcon
            variant='default'
            onClick={() => toggleColorScheme()}
            size={30}
            radius='sm'
          >
            {colorScheme === "dark" ? (
              <ImSun size={14} />
            ) : (
              <ImIcoMoon size={14} />
            )}
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  );
};

const User = () => {
  const theme = useMantineTheme();
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Link passHref href={router.pathname === "/settings" ? "/" : "/settings"}>
      <Box
        sx={{
          paddingTop: theme.spacing.sm,
          borderTop: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        }}
      >
        <UnstyledButton
          sx={{
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
            transition: "background 150ms ease",
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          }}
        >
          <Group noWrap>
            <Avatar
              src={session?.user?.image}
              radius='sm'
              color='brand'
              variant='light'
              size='sm'
            >
              {`${getWordInitials(session?.user?.name ?? "")}`}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Text
                size='sm'
                weight={500}
                sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {session?.user?.name}
              </Text>
              <Text
                color='dimmed'
                size='xs'
                sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {session?.user?.email}
              </Text>
            </Box>

            <FiChevronRight size={14} opacity={0.5} />
          </Group>
        </UnstyledButton>
      </Box>
    </Link>
  );
};

const Nav = ({
  opened,
  hiddenBreakpoint,
}: {
  opened: boolean;
  hiddenBreakpoint: MantineNumberSize;
}) => {
  const theme = useMantineTheme();

  return (
    <Navbar
      p='xs'
      width={{ sm: 260, lg: 280 }}
      hiddenBreakpoint={hiddenBreakpoint}
      hidden={!opened}
      sx={{
        backgroundColor: theme.colorScheme === "dark" ? "var(--nav-bg)" : "var(--nav-bg)",
        borderRight: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Navbar.Section mt='xs'>
        <Brand />
      </Navbar.Section>
      <Navbar.Section grow mt='md' component={ScrollArea}>
        {data.map((link, index) => (
          <MainLink {...link} key={link.label} />
        ))}
      </Navbar.Section>
      <Navbar.Section>
        <User />
      </Navbar.Section>
    </Navbar>
  );
};

export default Nav;
