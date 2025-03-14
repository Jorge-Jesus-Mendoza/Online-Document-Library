import React from "react";
import { useSocket } from "../../../context/SocketContext";
import UserIcon from "./UserIcon";
import { IoMdCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";

const CallNotification = () => {
  const { OngoingCall, handleJoinCall } = useSocket();

  if (!OngoingCall?.isRinging) return;
  return (
    <div className="bg-slate-500 absolute bg-opacity-70 w-screen h-screen top-0 bottom-0 flex items-center justify-center">
      <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
        <UserIcon
          user={OngoingCall.participants.caller}
          width={100}
          height={100}
          textColor
        />
        <div className="flex justify-around items-center w-full p-10">
          <button
            onClick={() => handleJoinCall(OngoingCall)}
            className="w-10 h-10 bg-green-500 flex items-center justify-center text-white rounded-full"
          >
            <IoMdCall size={24} />
          </button>
          <button className="w-10 h-10 bg-red-500 flex items-center justify-center text-white rounded-full">
            <MdCallEnd size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
