import React from "react";
import profileImage from "../../assets/images/119657882.jfif";

const UserImage = () => {
  return (
    <div className="border-2 border-[#5787C8] p-0.5 rounded-full">
      <span className="userImage flex w-[40px] h-[40px] overflow-hidden">
        <img src={profileImage} className="w-[100%] h-[100%] object-cover" />
      </span>
    </div>
  );
};

export default UserImage;
