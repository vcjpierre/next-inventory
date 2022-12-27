import Axios from "../config/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import getProductsTypes from "../types/getProducts";
import { ProductsWithDate } from "../types/getProducts";
import type postProductTypes from "../types/postProduct";
import { patchProductTypes } from "../types/patchProduct";

const getProducts = async (
  params: getProductsTypes
): Promise<ProductsWithDate[]> => {
  const response = await Axios.get("products", { params });
  return response?.data;
};

const postProduct = async (props: postProductTypes) => {
  const response = await Axios.post("product", props);
  return response?.data;
};

const deleteProduct = async (id: string) => {
  const response = await Axios.delete(`product`, { params: { id } });
  return response?.data;
};

const patchProduct = async (props: patchProductTypes) => {
  const response = await Axios.patch(`product`, props);
  return response?.data;
};

const useGetProducts = (params: getProductsTypes) =>
  useQuery(["products"], () => getProducts(params), { enabled: true });

const useGetProductsMutation = () => useMutation(["products"], getProducts);

const usePostProduct = () => useMutation(["product"], postProduct);

const useDeleteProduct = () => useMutation(["product"], deleteProduct);

const usePatchProdcuts = () => useMutation(["product"], patchProduct);

export {
  useGetProducts,
  getProducts,
  useGetProductsMutation,
  usePostProduct,
  useDeleteProduct,
  usePatchProdcuts,
};
