import Image from "next/image";
import React from "react";
import { SocketUser } from "../../../types/SocketUser";

interface Props {
  user: SocketUser;
  handleCall?: (user: SocketUser) => void;
  width?: number;
  height?: number;
  textColor?: boolean;
}
const UserIcon = ({
  user,
  handleCall,
  height = 50,
  width = 50,
  textColor,
}: Props) => {
  return (
    <button
      className="flex flex-col justify-center items-center "
      key={user.id}
      onClick={() => {
        handleCall && handleCall(user);
      }}
    >
      <Image
        alt="UserIcon"
        src={user.profile.image!}
        width={width}
        height={height}
        className="rounded-full"
      />
      <span className={textColor ? "text-black" : "text-white"}>
        {user.profile.name}
      </span>
    </button>
  );
};

export default UserIcon;
