<<<<<<< HEAD
import React from 'react'
import { useGetAllKoi } from '../../../hooks/koi/useGetAllKoi.js'
=======
import React from "react";
>>>>>>> 2430222247c023189d9cb8f78402684d19f5ceb5

const KoiManegement = () => {
    const { data: lstKoi } = useGetAllKoi()
    console.log(lstKoi)
  return (
<<<<<<< HEAD
      <></>
  )
}
=======
    <div className="container grid grid-cols-4 gap-[30px] my-[60px]">
      {Array(8).map((index) => {
        return (
          <div className="col-span-1" key={index}>
            a
            <img
              src="../../../images/exem.jpg"
              className="w-full rounded-[12px]"
              alt=""
            />
          </div>
        );
      })}
    </div>
  );
};
>>>>>>> 2430222247c023189d9cb8f78402684d19f5ceb5

export default KoiManegement;
