import { IProjectRequestParams, IProjectResponse } from "@/types/project";
import useSWR from "swr";

export function useProjects({ params, event }: { params: IProjectRequestParams; event?: boolean }) {
  const now = new Date();
  const year = now.getFullYear();

  const result = useSWR<IProjectResponse>({
    url: "/projects",
    query: event ? { ...params, year } : params,
  });

  return {
    data: result.data?.content,
    pageData: result.data && {
      pageSize: result.data.size,
      pageNumber: result.data.number,
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
    },
    get isLoading() {
      return result.isLoading;
    },
    get error() {
      return result.error;
    },
    get mutate() {
      return result.mutate;
    },
  };
}
