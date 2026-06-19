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
  Skeleton,
  Box,
  TextInput,
  Textarea,
  Center,
  Select,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { TbClipboardList } from "react-icons/tb";
import type { ProductsWithDate } from "../types/getProducts";
import { useGetProducts } from "../queries/ProductQueries";
import { FiSearch } from "react-icons/fi";
import { postProductSchema } from "../types/postProduct";
import { patchProductSchema } from "../types/patchProduct";
import { useGetCategoriesId } from "../queries/CategoryQueries";
import {
  usePostProduct,
  useDeleteProduct,
  usePatchProdcuts,
} from "../queries/ProductQueries";
import { queryClient } from "./_app";

const Products: CustomNextPage = () => {
  const { data: products, isLoading: productsLoading } = useGetProducts({
    take: "20",
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
  }, [autoCompleteValue, sortBy]);

  const [selectedProductId, setSelectedProductId] =
    useState<ProductsWithDate["id"]>("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductsWithDate["name"]>("");

  const [postProductModal, setPostModalProduct] = useState(false);
  const [deleteProductModal, setDeleteProductModal] = useState(false);
  const [patchProductModal, setPatchProductModal] = useState(false);
  const postProductForm = useForm({
    validate: zodResolver(postProductSchema),
    initialValues: {
      name: "",
      price: 0,
      description: "",
      categoryId: "",
    },
  });
  const patchProductForm = useForm({
    validate: zodResolver(patchProductSchema),
    initialValues: {
      id: "",
      name: "",
      price: 0,
      description: "",
      categoryId: "",
    },
  });

  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesId();

  interface selectCategory {
    value: string;
    label: string;
  }

  const [selectCategory, setSelectCategory] = useState<selectCategory[]>([]);
  useEffect(() => {
    if (categories) {
      setSelectCategory([]);
      categories.map((cat) =>
        setSelectCategory((selectData) => [
          ...selectData,
          { value: cat.id, label: cat.name },
        ])
      );
    }
  }, [categories]);

  const { mutate: postProduct, isLoading: postProductLoading } =
    usePostProduct();

  const { mutate: deleteProduct, isLoading: deleteProductLoading } =
    useDeleteProduct();

  const { mutate: patchProduct, isLoading: patchProductLoading } =
    usePatchProdcuts();

  return (
    <main>
      <Box mb="xl">
        <Text
          size="xs"
          color="dimmed"
          sx={{ fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}
          mb={4}
        >
          Catalog
        </Text>
        <Title
          order={2}
          sx={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Your Products
        </Title>
      </Box>

      <Group align="center" mb="1.5rem">
        <Autocomplete
          data={autoCompleteOption}
          value={autoCompleteValue}
          onChange={setAutoCompleteValue}
          placeholder="Search by Product Name..."
          nothingFound="No Products Found"
          icon={<FiSearch />}
          transition="pop-top-left"
          transitionDuration={80}
          transitionTimingFunction="easeInOut"
          sx={{ maxWidth: "600px", width: "100%" }}
        />
      </Group>

      {products?.length === 0 && !productsLoading && (
        <Group align="center">
          <Text size={"lg"}>No Products</Text>
          <TbClipboardList
            size={20}
            style={{ transform: "translateY(-1.5px)" }}
          />
        </Group>
      )}

      <Skeleton
        visible={productsLoading}
        sx={{ minHeight: products?.length === 0 ? "0px" : "150px" }}
      >
        <Grid grow gutter="sm" sx={{ height: "100%" }}>
          {Array.isArray(filteredProducts) &&
            filteredProducts.map((product) => {
              return (
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
                    p="xl"
                    shadow="sm"
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
                      size="sm"
                      color="dimmed"
                      mb="sm"
                      sx={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {product.category.name}
                    </Text>
                    <Text size="sm" color="dimmed" mt="sm" mb="sm" lineClamp={2}>
                      {product.description}
                    </Text>
                    <Group
                      spacing="md"
                      noWrap
                      mb="1.5rem"
                      sx={{ height: "100%" }}
                    >
                      <Stack sx={{ width: "100%", alignSelf: "flex-end" }} spacing={2}>
                        <Text size="xs" color="dimmed">Price</Text>
                        <Text weight={600} sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                          ${product.price.toFixed(2)}
                        </Text>
                      </Stack>
                      <Stack sx={{ width: "100%", alignSelf: "flex-end" }} spacing={2}>
                        <Text size="xs" color="dimmed">Stock</Text>
                        <Text weight={600} sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                          {product?.date[0] ? product?.date[0]?.stock : "0"}
                        </Text>
                      </Stack>
                    </Group>
                    <Group>
                      <Button
                        size="sm"
                        onClick={() => {
                          setPatchProductModal(true);
                          patchProductForm.setValues({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            description: product.description ?? "",
                            categoryId: product.categoryId,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        color="red"
                        onClick={() => {
                          setDeleteProductModal(true);
                          setSelectedProductId(product.id);
                          setSelectedProduct(product.name);
                        }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Paper>
                </Col>
              );
            })}
        </Grid>
      </Skeleton>

      <Box mt="3rem">
        <Button
          variant="outline"
          onClick={() => setPostModalProduct(true)}
          leftIcon={<TbClipboardList size={16} />}
        >
          Create Product
        </Button>
      </Box>

      <Modal
        onClose={() => setPostModalProduct(false)}
        opened={postProductModal}
        centered
        title="New Product"
      >
        <form
          onSubmit={postProductForm.onSubmit((values) => {
            postProduct(
              {
                categoryId: values.categoryId,
                description: values.description,
                name: values.name,
                price: values.price,
              },
              {
                onSuccess: () => {
                  setPostModalProduct(false);
                  queryClient.refetchQueries(["products"]);
                },
              }
            );
          })}
        >
          <LoadingOverlay
            visible={postProductLoading}
            transitionDuration={300}
          />
          <TextInput
            placeholder="Product Name"
            label="Name"
            withAsterisk
            mb="md"
            {...postProductForm.getInputProps("name")}
          />
          <NumberInput
            placeholder={0}
            label="Price"
            withAsterisk
            precision={2}
            step={0.5}
            mb="md"
            {...postProductForm.getInputProps("price")}
          />
          <Textarea
            placeholder="Product Description"
            label="Description"
            withAsterisk
            mb="md"
            {...postProductForm.getInputProps("description")}
          />
          <Select
            label="Categories"
            data={selectCategory}
            mb="md"
            placeholder="Select Category"
            withAsterisk
            {...postProductForm.getInputProps("categoryId")}
          />
          <Group>
            <Button type="submit">Create</Button>
            <Button variant="light" onClick={() => setPostModalProduct(false)}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        onClose={() => setDeleteProductModal(false)}
        opened={deleteProductModal}
        centered
        title="Delete Product"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            deleteProduct(selectedProductId, {
              onSuccess: () => {
                setDeleteProductModal(false);
                queryClient.refetchQueries(["products"]);
              },
            });
          }}
        >
          <LoadingOverlay visible={deleteProductLoading} />
          <Text align="center" color="red" size="md">
            Are you sure you want to delete
          </Text>
          <Text mb="xl" align="center" weight={600}>
            {selectedProduct}?
          </Text>
          <Center>
            <Group>
              <Button color="red" type={"submit"}>
                Delete
              </Button>
              <Button
                variant="light"
                onClick={() => setDeleteProductModal(false)}
              >
                Cancel
              </Button>
            </Group>
          </Center>
        </form>
      </Modal>

      <Modal
        onClose={() => setPatchProductModal(false)}
        opened={patchProductModal}
        centered
        title="Edit Product"
      >
        <form
          onSubmit={patchProductForm.onSubmit(() => {
            patchProduct(
              {
                id: patchProductForm.values.id,
                name: patchProductForm.values.name,
                price: patchProductForm.values.price,
                description: patchProductForm.values.description,
                categoryId: patchProductForm.values.categoryId,
              },
              {
                onSuccess: () => {
                  setPatchProductModal(false);
                  queryClient.refetchQueries(["products"]);
                },
              }
            );
          })}
        >
          <LoadingOverlay
            visible={patchProductLoading}
            transitionDuration={300}
          />
          <TextInput
            label="Name"
            placeholder="Product Name"
            mb="md"
            {...patchProductForm.getInputProps("name")}
          />
          <Textarea
            label="Description"
            placeholder="Product Description"
            mb="md"
            {...patchProductForm.getInputProps("description")}
          />
          <NumberInput
            label="Price"
            placeholder="Product Price"
            mb="md"
            precision={2}
            step={0.5}
            {...patchProductForm.getInputProps("price")}
          />
          <Select
            label="Categories"
            data={selectCategory}
            mb="md"
            placeholder="Select Category"
            {...patchProductForm.getInputProps("categoryId")}
          />
          <Group>
            <Button type="submit">Save</Button>
            <Button variant="light" onClick={() => setPatchProductModal(false)}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
    </main>
  );
};

Products.requireAuth = true;

export default Products;
