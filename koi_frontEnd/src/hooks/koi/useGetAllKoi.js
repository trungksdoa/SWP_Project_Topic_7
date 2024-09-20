import {manageKoiFishServices} from "../../services/koifish/manageKoiFishServices.js";
import { useQuery } from "@tanstack/react-query";
import { sleep } from "../../utils/sleep";
export const useGetAllKoi = () => {
    const q = useQuery({
        queryKey: ["koi"],
        queryFn: async () => {
            await sleep(2000)
            return await manageKoiFishServices.getAllKoi();
        },
    });
    return {
        ...q,
        data: q?.data?.data?.data,
    };
};