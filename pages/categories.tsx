import React, { useEffect, useState } from "react";
import { CustomNextPage } from "../types/CustomNextPage";
import {
  Title,
  Group,
  Button,
  Box,
  Table,
  Select,
  Skeleton,
  Modal,
  TextInput,
  Text,
  LoadingOverlay,
  Accordion,
  Alert,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { BiCategory } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { MdWarningAmber } from "react-icons/md";
import {
  usePostCategory,
  useDeleteCategory,
  usePatchCategory,
  useGetCategories,
} from "../queries/CategoryQueries";

import { type GetCategory } from "../types/getCategories";
import { PostCategorySchema } from "../types/postCategory";
import { PatchCategorySchema } from "../types/patchCategory";
import { queryClient } from "./_app";

const Categories: CustomNextPage = () => {
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();

  const [value, setValue] = useState<string | null>(null);
  const [selectData, setSelectData] = useState<GetCategory["name"][]>([]);
  const [selectValue, setSelectValue] = useState<GetCategory["name"] | null>();
  const [filteredValues, setFilteredValues] = useState<GetCategory[]>();
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [changeModal, setChangeModal] = useState<boolean>(false);

  useEffect(() => {
    setSelectData([]);
    if (Array.isArray(categories)) {
      categories.map((ctg) =>
        setSelectData((selectData) => [...selectData, ctg.name])
      );
    }
  }, [categories]);

  useEffect(() => {
    if (selectValue) {
      setFilteredValues(categories?.filter((ctg) => ctg.name === selectValue));
    } else {
      setFilteredValues(categories);
    }
  }, [selectValue, categories]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const createCategoryForm = useForm({
    validate: zodResolver(PostCategorySchema),
    initialValues: {
      name: "",
    },
  });
  const { mutate: postCategory, isLoading: postCategoryLoading } =
    usePostCategory();
  const { mutate: deleteCategory, isLoading: deleteCategoryLoading } =
    useDeleteCategory();

  const PatchCategoryForm = useForm({
    validate: zodResolver(PatchCategorySchema),
    initialValues: {
      name: "",
      id: "",
    },
  });

  const { mutate: patchCategory, isLoading: patchCategoryLoading } =
    usePatchCategory();

  return (
    <main>
      <Box mb="xl">
        <Text
          size="xs"
          color="dimmed"
          sx={{ fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}
          mb={4}
        >
          Organization
        </Text>
        <Title
          order={2}
          sx={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Your Categories
        </Title>
      </Box>

      <Select
        data={selectData}
        value={selectValue}
        onChange={setSelectValue}
        clearable
        searchable
        placeholder="Search Something..."
        nothingFound="No Categories Found"
        icon={<FiSearch />}
        transition="pop-top-left"
        transitionDuration={80}
        transitionTimingFunction="easeInOut"
        sx={{ maxWidth: "600px" }}
        mb="1.5rem"
      />

      {categories?.length === 0 && !categoriesLoading && (
        <Box>
          <Group align="center">
            <Text size={"lg"}>No Categories</Text>
            <BiCategory size={20} style={{ transform: "translateY(-1.5px)" }} />
          </Group>
        </Box>
      )}

      <Skeleton
        mb={"3rem"}
        visible={categoriesLoading ? true : false}
        style={{ minHeight: "80px" }}
      >
        <Accordion value={value} onChange={setValue} transitionDuration={500}>
          {Array.isArray(filteredValues) &&
            filteredValues.map((category: GetCategory, index) => (
              <Accordion.Item
                value={category.name}
                sx={{ overflowX: "auto" }}
                key={index}
              >
                <Accordion.Control>
                  <Text weight={600}>{category.name}</Text>
                </Accordion.Control>
                <Accordion.Panel
                  sx={{
                    width: "max-content",
                    minWidth: "100%",
                  }}
                >
                  <Table verticalSpacing="md" horizontalSpacing="md">
                    <thead>
                      <tr>
                        <th style={{ paddingLeft: "0" }}>Name</th>
                        <th style={{ paddingLeft: "0" }}>Price</th>
                        <th style={{ paddingLeft: "0" }}>ID</th>
                        <th style={{ paddingLeft: "0" }}>Last Updated</th>
                        <th style={{ paddingLeft: "0" }}>Stock</th>
                      </tr>
                    </thead>

                    {category?.products?.map((product) => (
                      <tr key={product.name}>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            {product.name}
                          </div>
                        </td>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            <Text sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                              ${product.price.toFixed(2)}
                            </Text>
                          </div>
                        </td>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            <Text size="xs" color="dimmed" sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                              {product.id.slice(0, 8)}...
                            </Text>
                          </div>
                        </td>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            {product.lastUpdated.toString()}
                          </div>
                        </td>
                        <td>
                          <div style={{ paddingRight: "1rem" }}>
                            <Text weight={600} sx={{ fontFamily: "JetBrains Mono, monospace" }}>
                              {product?.date[0]?.stock ?? "0"}
                            </Text>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Table>
                  <Group mt="md">
                    <Button
                      size="sm"
                      onClick={() => {
                        PatchCategoryForm.values.name = category.name;
                        setChangeModal(true);
                        setSelectedCategory(category.id);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      color="red"
                      onClick={() => {
                        setDeleteModal(true);
                        setSelectedCategory(category.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Group>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
        </Accordion>
      </Skeleton>

      <Box>
        <Button
          variant={"outline"}
          onClick={() => setCreateModal(true)}
          leftIcon={<BiCategory size={16} />}
        >
          Create Category
        </Button>
      </Box>

      <Modal
        centered
        opened={createModal}
        onClose={() => setCreateModal(false)}
        title="New Category"
      >
        <form
          onSubmit={createCategoryForm.onSubmit((values) => console.log(values))}
        >
          <LoadingOverlay
            transitionDuration={500}
            visible={postCategoryLoading ? true : false}
          />
          <TextInput
            placeholder="Category name"
            label="Category name"
            withAsterisk
            mb="1rem"
            {...createCategoryForm.getInputProps("name")}
          />
          <Group>
            <Button
              type="submit"
              onClick={() =>
                postCategory(
                  { name: createCategoryForm.values.name },
                  {
                    onSuccess: () => {
                      setCreateModal(false);
                      queryClient.refetchQueries(["categories"]);
                    },
                  }
                )
              }
            >
              Create
            </Button>
            <Button variant="light" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        centered
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Category"
      >
        <Alert
          icon={<MdWarningAmber size={20} />}
          color="red"
          mb="md"
        >
          <Text weight={600}>You cannot undo this action!</Text>
          <Text size="sm">All products in this category will be deleted.</Text>
        </Alert>
        <Group>
          <Button variant="light" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() =>
              deleteCategory(selectedCategory, {
                onSuccess: () => {
                  queryClient.refetchQueries(["categories"]);
                  setDeleteModal(false);
                },
              })
            }
          >
            Delete Category
          </Button>
        </Group>
      </Modal>

      <Modal
        centered
        opened={changeModal}
        onClose={() => setChangeModal(false)}
        title="Edit Category"
      >
        <form
          onSubmit={PatchCategoryForm.onSubmit((values) => console.log(values))}
        >
          <LoadingOverlay
            transitionDuration={500}
            visible={patchCategoryLoading ? true : false}
          />
          <TextInput
            placeholder="Category name"
            label="Category name"
            withAsterisk
            mb="1rem"
            {...PatchCategoryForm.getInputProps("name")}
          />
          <Group mt="1.5rem">
            <Button
              type="submit"
              onClick={() => {
                patchCategory(
                  {
                    name: PatchCategoryForm.values.name,
                    id: selectedCategory,
                  },
                  {
                    onSuccess: () => {
                      queryClient.refetchQueries(["categories"]);
                      setChangeModal(false);
                    },
                  }
                );
              }}
            >
              Save
            </Button>
            <Button
              variant="light"
              onClick={() => {
                setChangeModal(false);
              }}
            >
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
    </main>
  );
};

Categories.requireAuth = true;
export default Categories;
