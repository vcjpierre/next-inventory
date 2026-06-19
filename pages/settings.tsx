import {
  Box,
  Group,
  Title,
  Text,
  Stack,
  Button,
  Modal,
  LoadingOverlay,
  Avatar,
  Paper,
  Divider,
} from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { FiSettings } from "react-icons/fi";
import { CustomNextPage } from "../types/CustomNextPage";
import { useState } from "react";
import { useDelAccount } from "../queries/AccountQueries";
import { queryClient } from "./_app";
import { MdWarningAmber } from "react-icons/md";

const getWordInitials = (word: string): string => {
  const bits = word.trim().split(" ");
  return bits
    .map((bit) => bit.charAt(0))
    .join("")
    .toUpperCase();
};

const Settings: CustomNextPage = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const { data: session } = useSession();
  const { mutate: delAcc, isLoading: delAccLoading } = useDelAccount();
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box mb="xl">
        <Text
          size="xs"
          color="dimmed"
          sx={{ fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}
          mb={4}
        >
          Preferences
        </Text>
        <Title
          order={2}
          sx={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Settings
        </Title>
      </Box>

      <Paper
        p="xl"
        withBorder
        sx={{
          maxWidth: 480,
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <Stack align="center" spacing="md">
          <Avatar
            src={session?.user?.image}
            radius="sm"
            color="brand"
            variant="light"
            size="xl"
          >
            {`${getWordInitials(session?.user?.name ?? "")}`}
          </Avatar>

          <div style={{ textAlign: "center" }}>
            <Text weight={600} size="lg">
              {session?.user?.name}
            </Text>
            <Text color="dimmed" size="sm">
              {session?.user?.email}
            </Text>
          </div>

          <Divider sx={{ width: "100%" }} />

          <Button
            fullWidth
            onClick={() => signOut()}
            leftIcon={<FiSettings size={16} />}
          >
            Sign out
          </Button>
          <Button
            fullWidth
            color="red"
            variant="outline"
            onClick={() => setDeleteModal(true)}
          >
            Delete My Account
          </Button>
        </Stack>
      </Paper>

      <Modal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        centered
        title="Account Deletion"
      >
        <LoadingOverlay visible={delAccLoading} />
        <Stack align="center" spacing="lg" py="md">
          <MdWarningAmber size={40} color="#e8593a" />
          <Text align="center" color="red" weight={500}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Text>
          <Group>
            <Button
              variant="light"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() =>
                delAcc(undefined, {
                  onError: () => {
                    setDeleteModal(false);
                    window.location.reload();
                  },
                })
              }
              disabled={delAccLoading}
            >
              Delete My Account
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

Settings.requireAuth = true;

export default Settings;
