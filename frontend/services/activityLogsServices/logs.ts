import api from "../../hooks/useAxios";

export const getAllActivityLogs = (
  currentPage: number,
  limit: number,
  search: string
) =>
  api.get(
    `/logs/getAllActivityLogs?page=${currentPage}&limit=${limit}&search=${search}`
  );
