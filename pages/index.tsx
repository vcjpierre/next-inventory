import Head from "next/head";
import type { CustomNextPage } from "../types/CustomNextPage";
import { Box, Group, ThemeIcon, Title } from "@mantine/core";
import { AiOutlineHome } from "react-icons/ai";
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
        {/* TITLE */}
        <Group align="center" mb={"3rem"}>
          <Title size="1.5rem" weight="500">
            Latest Updated Products
          </Title>
          <ThemeIcon variant="light" color="blue" size="md">
            <AiOutlineHome size={22} />
          </ThemeIcon>
        </Group>

        {!productsLoading && products && !productsRefetching && (
          <Box
            sx={{
              maxWidth: "90%",
            }}
          >
            {products?.map((product) => {
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
