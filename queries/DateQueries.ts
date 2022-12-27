import axios from "../config/axios";
import { useMutation } from "@tanstack/react-query";
import { PostDate } from "../types/postDate";

const postDate = async (props: PostDate) => {
  const response = await axios.post("date", props);
  return response.data;
};

const deleteDate = async ({
  productId,
  id,
}: {
  productId: string;
  id: string;
}) => {
  const response = await axios.delete(`date`, { data: { productId, id } });
  return response.data;
};

const usePostDate = () => useMutation(["postDate"], postDate);
const useDeleteDate = () => useMutation(["deleteDate"], deleteDate);
export { usePostDate, useDeleteDate };
