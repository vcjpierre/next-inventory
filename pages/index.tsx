import Head from "next/head";
import type { CustomNextPage } from "../types/CustomNextPage";
import { Box, Group, Title, Text } from "@mantine/core";
import { LineChart } from "../components/LineChart";
import { useGetProducts } from "../queries/ProductQueries";
import { useMantineColorScheme } from "@mantine/core";

const Home: CustomNextPage = () => {
  const {
    data: products,
    isLoading: productsLoading,
    refetch,
    isRefetching: productsRefetching,
  } = useGetProducts({
    take: "3",
    dates: "20",
  });
  const { colorScheme } = useMantineColorScheme();

  return (
    <div>
      <Head>
        <title>Invetory App</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Box mb="xl">
          <Text
            size="xs"
            color="dimmed"
            sx={{ fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}
            mb={4}
          >
            Overview
          </Text>
          <Title
            order={2}
            sx={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Latest Products
          </Title>
        </Box>

        {!productsLoading && products && !productsRefetching && (
          <Box
            sx={{
              maxWidth: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {Array.isArray(products) && products.map((product) => {
              return <LineChart product={product} key={product.id} colorsScheme={colorScheme} />;
            })}
          </Box>
        )}
      </div>
    </div>
  );
};

Home.requireAuth = true;

export default Home;
