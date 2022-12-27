import React, { useEffect, useState } from "react";
import { CustomNextPage } from "../types/CustomNextPage";
import {
  Title,
  Group,
  ThemeIcon,
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
  //ACCORDION VALUE
  const [value, setValue] = useState<string | null>(null);
  //SEARCH VALUE & DATA
  const [selectData, setSelectData] = useState<GetCategory["name"][]>([]);
  const [selectValue, setSelectValue] = useState<GetCategory["name"] | null>();
  //FILTER VALUES
  const [filteredValues, setFilteredValues] = useState<GetCategory[]>();
  //MODAL VALUES
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [changeModal, setChangeModal] = useState<boolean>(false);

  //SET SELECT DATA FOR SEACH
  useEffect(() => {
    setSelectData([]);
    if (categories) {
      categories.map((ctg) =>
        setSelectData((selectData) => [...selectData, ctg.name])
      );
    }
  }, [categories]);

  //FILTER THE DATA BY THE SELECTED VALUE
  useEffect(() => {
    if (selectValue) {
      setFilteredValues(categories?.filter((ctg) => ctg.name === selectValue));
    } else {
      setFilteredValues(categories);
    }
  }, [selectValue, categories]);

  //SELECTED CATEGORY ID
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  //VALIDATE POST CATEGORY FORM
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

  //VALIDATE PATCH CATEGORY FORM
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
      {/* TITLE */}
      <Group align='center' mb={"3rem"}>
        <Title size='1.5rem' weight='500'>
          Your Categories
        </Title>
        <ThemeIcon variant='light' color='green' size='md'>
          <BiCategory size={25} />
        </ThemeIcon>
      </Group>

      {/* SELECT COMPONENT */}
      <Select
        data={selectData}
        value={selectValue}
        onChange={setSelectValue}
        clearable
        searchable
        placeholder='Seach Something...'
        nothingFound='No Categories Found'
        icon={<FiSearch />}
        transition='pop-top-left'
        transitionDuration={80}
        transitionTimingFunction='easeInOut'
        sx={{ maxWidth: "600px" }}
        mb='1.5rem'
      />

      {/* NO CATEGORIES */}
      {categories?.length === 0 && !categoriesLoading && (
        <Box>
          <Group align='center'>
            <Text size={"lg"}>No Invetory</Text>
            <FiSearch size={20} style={{ transform: "translateY(-1.5px)" }} />
          </Group>
        </Box>
      )}

      {/* ACCORDION FOR THE DATA */}
      <Skeleton
        mb={"3rem"}
        visible={categoriesLoading ? true : false}
        style={{ minHeight: "80px" }}
      >
        <Accordion value={value} onChange={setValue} transitionDuration={500}>
          {filteredValues?.map((category: GetCategory, index) => (
            <Accordion.Item
              value={category.name}
              sx={{ overflowX: "auto" }}
              key={index}
            >
              <Accordion.Control>{category.name}</Accordion.Control>
              <Accordion.Panel
                sx={{
                  width: "max-content",
                  minWidth: "100%",
                }}
              >
                <Table verticalSpacing='md' horizontalSpacing='md'>
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: "0" }}>Name</th>
                      <th style={{ paddingLeft: "0" }}>Price</th>
                      <th style={{ paddingLeft: "0" }}>Id</th>
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
                          {product.price}
                        </div>
                      </td>
                      <td>
                        <div style={{ paddingRight: "1rem" }}>{product.id}</div>
                      </td>
                      <td>
                        <div style={{ paddingRight: "1rem" }}>
                          {product.lastUpdated.toString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ paddingRight: "1rem" }}>
                          {product?.date[0]?.stock}
                        </div>
                      </td>
                    </tr>
                  ))}
                </Table>
                <Group>
                  <Button
                    mt='1.5rem'
                    color={"blue"}
                    onClick={() => {
                      PatchCategoryForm.values.name = category.name;
                      setChangeModal(true);
                      setSelectedCategory(category.id);
                    }}
                  >
                    Change Details
                  </Button>
                  <Button
                    mt='1.5rem'
                    color={"red"}
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

      {/*ACTIONS FOR CATEGORIES  */}
      <Box>
        <Button
          color={"blue"}
          variant={"outline"}
          onClick={() => setCreateModal(true)}
        >
          Create Category
        </Button>
      </Box>

      {/* MODALS */}
      {/* CREATE CATEGORY */}
      <Modal
        centered
        opened={createModal}
        onClose={() => setCreateModal(false)}
        title='Create Category'
      >
        <form
          onSubmit={createCategoryForm.onSubmit((values) =>
            console.log(values)
          )}
        >
          <LoadingOverlay
            transitionDuration={500}
            visible={postCategoryLoading ? true : false}
          />
          <TextInput
            placeholder='Category name'
            label='Category name'
            withAsterisk
            mb='1rem'
            {...createCategoryForm.getInputProps("name")}
          />
          <Group noWrap={false}>
            <Button
              type='submit'
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
            <Button color='red' onClick={() => setCreateModal(false)}>
              Exit
            </Button>
          </Group>
        </form>
      </Modal>
      {/* DELETE CATEGORY */}
      <Modal
        centered
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        title='Delete Category'
      >
        <LoadingOverlay visible={deleteCategoryLoading ? true : false} />
        <Group align='center' mb='1rem'>
          <MdWarningAmber size={25} color='#fa5252' />
          <Title color='red' size='md'>
            You Cannot Undo This Action!
          </Title>
        </Group>
        <Text mb='1rem' color='red' weight={600}>
          All Products In This Category Will Be Deleted!
        </Text>
        <Group noWrap={false}>
          <Button onClick={() => setDeleteModal(false)}>Exit</Button>
          <Button
            color='red'
            onClick={() =>
              deleteCategory(selectedCategory, {
                onSuccess: () => {
                  queryClient.refetchQueries(["categories"]);
                  setDeleteModal(false);
                },
              })
            }
          >
            Delete !
          </Button>
        </Group>
      </Modal>
      {/* CHANGE DETAILS MODAL */}
      <Modal
        centered
        opened={changeModal}
        onClose={() => setChangeModal(false)}
        title='Change Category Details'
      >
        <form
          onSubmit={PatchCategoryForm.onSubmit((values) => console.log(values))}
        >
          <LoadingOverlay
            transitionDuration={500}
            visible={patchCategoryLoading ? true : false}
          />
          <TextInput
            placeholder='Category name'
            label='Category name'
            withAsterisk
            mb='1rem'
            {...PatchCategoryForm.getInputProps("name")}
          />
          <Group mt='1.5rem'>
            <Button
              type='submit'
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
              Change Details
            </Button>
            <Button
              color={"red"}
              onClick={() => {
                setChangeModal(false);
              }}
            >
              Exit
            </Button>
          </Group>
        </form>
      </Modal>
    </main>
  );
};

Categories.requireAuth = true;
export default Categories;
