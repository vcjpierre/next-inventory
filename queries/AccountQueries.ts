import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "../config/axios";

const delAccount = async () => {
  const { data } = await axios.delete("/me");
  return data;
};

const useDelAccount = () => useMutation(["me"], delAccount);

export { useDelAccount };
