import React from "react";

const KoiManegement = () => {
  return (
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

export default KoiManegement;
