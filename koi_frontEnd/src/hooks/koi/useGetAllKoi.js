import {manageKoiFishServices} from "../../services/koifish/manageKoiFishServices.js";
import { useQuery } from "@tanstack/react-query";
import { sleep } from "../../utils/sleep";
export const useGetAllKoi = (id) => {
    const q = useQuery({
        queryKey: ["koi"],
        queryFn: async () => {
            await sleep(1000)
            return await manageKoiFishServices.getKoiByUserId(id);
        },
    });
    return {
        ...q,
        data: q?.data?.data?.data?.content,
    };
};