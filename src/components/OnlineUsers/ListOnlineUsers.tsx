import React from "react";
import { SocketUser } from "../../../types/SocketUser";
import UserIcon from "./UserIcon";

interface Props {
  OnlineUsers: SocketUser[];
  user: SocketUser;
}

const ListOnlineUsers: React.FC<Props> = ({ OnlineUsers, user }) => {
  const hasOnlineUsers = OnlineUsers && OnlineUsers.length > 0;

  return hasOnlineUsers ? (
    OnlineUsers.filter((sockUser) => sockUser.id !== user.id).map(
      (socketUser) => <UserIcon user={socketUser} key={socketUser.id} />
    )
  ) : (
    <span className="text-white">Cargando Usuarios...</span>
  );
};

export default ListOnlineUsers;
