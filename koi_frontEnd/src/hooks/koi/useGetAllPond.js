import {managePondServices} from "../../services/koifish/managePondServices.js";
import { useQuery } from "@tanstack/react-query";
import { sleep } from "../../utils/sleep";
export const useGetAllPond = () => {
    const q = useQuery({
        queryKey: ["pond"],
        queryFn: async () => {
            await sleep(1000)
            return await managePondServices.getAllPond();
        },
    });
    return {
        ...q,
        data: q?.data?.data?.data?.content,
    };
}