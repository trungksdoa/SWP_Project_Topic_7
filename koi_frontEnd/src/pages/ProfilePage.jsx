import React from "react";
import ProfileTemplate from "../components/template/ProfileTemplage";
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent";

const ProfilePage = () => {
  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Profile" }]}
      />
      <ProfileTemplate />
    </div>
  );
};

export default ProfilePage;
