import React, { useEffect, useState } from "react";
import { CustomNextPage } from "../types/CustomNextPage";
import {
  Group,
  Title,
  Grid,
  Text,
  Col,
  Paper,
  Stack,
  Autocomplete,
  Button,
  Modal,
  NumberInput,
  LoadingOverlay,
  Box,
  Skeleton,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { BsBox } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { useGetProducts } from "../queries/ProductQueries";
import { type ProductsWithDate } from "../types/getProducts";
import { PostDateSchema } from "../types/postDate";
import { DeleteDateSchema } from "../types/deleteDate";
import { usePostDate, useDeleteDate } from "../queries/DateQueries";
import { queryClient } from "./_app";
import Link from "next/link";
import { DateTime } from "luxon";

const Inventory: CustomNextPage = () => {
  const { data: products, isLoading: productsLoading } = useGetProducts({
    take: "20",
    dates: "50",
  });
  const [autoCompleteOption, setAutoCompleteOptions] = useState<
    ProductsWithDate["name"][]
  >([]);
  const [autoCompleteValue, setAutoCompleteValue] =
    useState<ProductsWithDate["name"]>();
  const [filteredProducts, setFilteredProducts] = useState<
    ProductsWithDate[] | undefined
  >([]);
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "quantity" | null | string
  >("name");

  useEffect(() => {
    setAutoCompleteOptions([]);
    if (Array.isArray(products)) {
      products.map((prod) =>
        setAutoCompleteOptions((selectData) => [...selectData, prod.name])
      );
    }
    setFilteredProducts(products);
  }, [products]);

  useEffect(() => {
    if (autoCompleteValue && products) {
      setFilteredProducts((products) =>
        products?.filter((prod) =>
          prod.name.toLowerCase().includes(autoCompleteValue.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [autoCompleteValue, products, sortBy]);

  const [changeCurrentInventoryModal, setChangeCurrentInventoryModal] =
    useState(false);
  const [invetoryChangesModal, setInvetoryChangesModal] = useState(false);

  const patchInventoryForm = useForm({
    validate: zodResolver(PostDateSchema),
    initialValues: {
      productId: "",
      date: new Date(),
      stock: 0,
    },
  });

  const deleteInventoryForm = useForm({
    validate: zodResolver(DeleteDateSchema),
    initialValues: {
      productId: "",
      id: "",
    },
  });

  const { mutate: PostDate, isLoading: PostDateLoading } = usePostDate();
  const { mutate: DeleteDate, isLoading: DeleteDateLoading } = useDeleteDate();

  const [selectedProduct, setSelectedProduct] = useState<ProductsWithDate>();

  return (
    <main>
      <Box mb="xl">
        <Text
          size="xs"
          color="dimmed"
          sx={{ fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}
          mb={4}
        >
          Stock Control
        </Text>
        <Title
          order={2}
          sx={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Your Inventory
        </Title>
      </Box>

      <Group align='center' mb='1.5rem'>
        <Autocomplete
          data={autoCompleteOption}
          value={autoCompleteValue}
          onChange={setAutoCompleteValue}
          placeholder='Search by Product Name...'
          nothingFound='No Products Found'
          icon={<FiSearch />}
          transition='pop-top-left'
          transitionDuration={80}
          transitionTimingFunction='easeInOut'
          sx={{ maxWidth: "600px", width: "100%" }}
        />
      </Group>

      {products?.length === 0 && !productsLoading && (
        <Box>
          <Group align='center'>
            <Text size={"lg"}>No Inventory</Text>
            <BsBox size={20} style={{ transform: "translateY(-1.5px)" }} />
          </Group>
          <Link passHref href='/products'>
            <Button component='a' mt='3rem' variant='outline'>
              Create A Product
            </Button>
          </Link>
        </Box>
      )}

      <Skeleton
        visible={productsLoading}
        sx={{ minHeight: products?.length === 0 ? "0px" : "150px" }}
      >
        <Grid grow gutter='sm' sx={{ height: "100%" }}>
          {Array.isArray(filteredProducts) &&
            filteredProducts.map((product) => (
              <Col
                span={3}
                order={2}
                orderSm={1}
                orderLg={3}
                key={product.id}
                sx={{
                  minWidth: "340px",
                  "@media (max-width: 350px)": {
                    minWidth: "100%",
                  },
                }}
              >
                <Paper
                  p='xl'
                  shadow='sm'
                  withBorder
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <Title
                    order={3}
                    sx={{
                      fontFamily: "Archivo, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {product.name}
                  </Title>
                  <Text
                    size='sm'
                    color='dimmed'
                    mb='sm'
                    sx={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {product.category.name}
                  </Text>
                  <Text
                    size='sm'
                    color='dimmed'
                    mt='sm'
                    mb='sm'
                    lineClamp={2}
                  >
                    {product.description}
                  </Text>
                  <Group
                    spacing='md'
                    noWrap
                    mb='1.5rem'
                    sx={{ height: "100%" }}
                  >
                    <Stack sx={{ width: "100%", alignSelf: "flex-end" }} spacing={2}>
                      <Text size='xs' color='dimmed'>Current Price</Text>
                      <Text weight={600} sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                        ${product.price.toFixed(2)}
                      </Text>
                    </Stack>
                    <Stack sx={{ width: "100%", alignSelf: "flex-end" }} spacing={2}>
                      <Text size='xs' color='dimmed'>Current Stock</Text>
                      <Text weight={600} sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                        {product?.date[0] ? product?.date[0]?.stock : "0"}
                      </Text>
                    </Stack>
                  </Group>
                  <Group>
                    <Button
                      size='sm'
                      onClick={() => {
                        patchInventoryForm.setFieldValue(
                          "productId",
                          product.id
                        );
                        patchInventoryForm.setFieldValue(
                          "stock",
                          product.date[0]?.stock
                        );
                        setChangeCurrentInventoryModal(true);
                      }}
                    >
                      Update Stock
                    </Button>
                    <Button
                      size='sm'
                      variant='light'
                      onClick={() => {
                        setInvetoryChangesModal(true);
                        setSelectedProduct(product);
                        deleteInventoryForm.setFieldValue(
                          "productId",
                          product.id
                        );
                        deleteInventoryForm.setFieldValue(
                          "id",
                          product.date[0]?.id
                        );
                      }}
                    >
                      History
                    </Button>
                  </Group>
                </Paper>
              </Col>
            ))}
        </Grid>
      </Skeleton>

      <Modal
        opened={changeCurrentInventoryModal}
        onClose={() => setChangeCurrentInventoryModal(false)}
        title='Update Inventory'
        centered
      >
        <form
          onSubmit={patchInventoryForm.onSubmit(() => {
            PostDate(
              {
                productId: patchInventoryForm.values.productId,
                date: patchInventoryForm.values.date,
                stock: patchInventoryForm.values.stock,
              },
              {
                onSuccess: () => {
                  setChangeCurrentInventoryModal(false);
                  queryClient.refetchQueries(["products"]);
                },
              }
            );
          })}
        >
          <LoadingOverlay visible={PostDateLoading} transitionDuration={500} />
          <NumberInput
            placeholder='Stock Number'
            label='Stock'
            withAsterisk
            mb='1rem'
            {...patchInventoryForm.getInputProps("stock")}
          />
          <DatePicker
            placeholder='Pick date'
            label='Event date'
            labelFormat='MM/YYYY'
            mb='1rem'
            maxDate={new Date()}
            {...patchInventoryForm.getInputProps("date")}
          />
          <Group>
            <Button type='submit'>Save</Button>
            <Button
              variant='light'
              onClick={() => setChangeCurrentInventoryModal(false)}
            >
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        opened={invetoryChangesModal}
        onClose={() => setInvetoryChangesModal(false)}
        title={`Latest ${selectedProduct?.date.length} inventory changes`}
        centered
        overflow='inside'
      >
        <Stack>
          {selectedProduct?.date.map((date) => (
            <form
              onSubmit={deleteInventoryForm.onSubmit((values) =>
                DeleteDate(
                  {
                    id: date.id,
                    productId: values.productId,
                  },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries(["products"]);
                      setInvetoryChangesModal(false);
                    },
                  }
                )
              )}
              key={date.id}
            >
              <LoadingOverlay
                visible={DeleteDateLoading}
                transitionDuration={300}
              />
              <Paper
                p='sm'
                withBorder
                sx={{
                  backgroundColor: "transparent",
                  borderColor: "var(--border)",
                }}
              >
                <Group position='apart' align='center'>
                  <Text size='sm' sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                    {DateTime.fromISO(date?.date as any).toISODate()}
                  </Text>
                  <Text
                    size='sm'
                    weight={600}
                    sx={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    Stock: {date.stock}
                  </Text>
                  <Button
                    color='red'
                    size='xs'
                    type='submit'
                  >
                    Delete
                  </Button>
                </Group>
              </Paper>
            </form>
          ))}
          {selectedProduct?.date.length === 0 && (
            <Text color='dimmed' align='center'>
              No inventory changes found
            </Text>
          )}
        </Stack>
      </Modal>
    </main>
  );
};

Inventory.requireAuth = true;
export default Inventory;
