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
} from "@mantine/core";
import React from "react";
import Link from "next/link";
import { BiCategory } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { TbClipboardList } from "react-icons/tb";
import { AiOutlineHome } from "react-icons/ai";
import { ImSun, ImIcoMoon } from "react-icons/im";
import { GoArchive } from "react-icons/go";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
  return (
    <Link href={pageLink} passHref>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          backgroundColor:
            router.pathname === pageLink
              ? theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0]
              : "transparent",
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant='light'>
            {icon}
          </ThemeIcon>

          <Text size='sm'>{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
};

const data: MainLinkProps[] = [
  {
    icon: <AiOutlineHome size={18} />,
    color: "blue",
    label: "Home",
    pageLink: "/",
  },
  {
    icon: <BiCategory size={18} />,
    color: "teal",
    label: "Categories",
    pageLink: "/categories",
  },
  {
    icon: <BsBox size={16} />,
    color: "violet",
    label: "Inventory",
    pageLink: "/inventory",
  },
  {
    icon: <TbClipboardList size={20} />,
    color: "grape",
    label: "Products",
    pageLink: "/products",
  },
  {
    icon: <FiSettings size={16} />,
    color: "orange",
    label: "Settings",
    pageLink: "/settings",
  },
];

const Brand = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
        paddingBottom: theme.spacing.lg,
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Group position='apart' align='center'>
        <Group>
          <ThemeIcon
            variant='gradient'
            gradient={{ from: "indigo", to: "cyan" }}
            size='lg'
            radius='lg'
          >
            <GoArchive size={18} />
          </ThemeIcon>
          <Title size={"1.2rem"} weight={400} sx={{ fontStyle: "italic" }}>
            Invetory
          </Title>
        </Group>

        <ActionIcon
          variant='default'
          onClick={() => toggleColorScheme()}
          size={30}
        >
          {colorScheme === "dark" ? (
            <ImSun size={18} />
          ) : (
            <ImIcoMoon size={18} />
          )}
        </ActionIcon>
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

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          }}
        >
          <Group>
            <Avatar
              src={session?.user?.image}
              radius='xl'
              color='blue'
              variant='light'
            >
              {`${getWordInitials(session?.user?.name ?? "")}`}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Text size='sm' weight={500}>
                {session?.user?.name}
              </Text>
              <Text color='dimmed' size='xs'>
                {session?.user?.email}
              </Text>
            </Box>

            {router.pathname === "/settings" ? (
              <MdKeyboardArrowLeft size={18} />
            ) : (
              <MdKeyboardArrowRight size={18} />
            )}
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
  return (
    <Navbar
      p='xs'
      width={{ sm: 300, lg: 300 }}
      hiddenBreakpoint={hiddenBreakpoint}
      hidden={!opened}
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
