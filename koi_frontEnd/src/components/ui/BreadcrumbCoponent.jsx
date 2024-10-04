import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const BreadcrumbComponent = ({ items }) => {
  return (
    <Breadcrumb className="mt-[15px]">
      {items.map((item, index) => (
        <Breadcrumb.Item key={index}>
          {item.path ? <Link to={item.path}>{item.name}</Link> : item.name}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
