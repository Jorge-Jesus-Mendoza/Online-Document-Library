import React, { useEffect, useRef } from "react";
import { MdCallEnd, MdCamera, MdMic, MdMicOff } from "react-icons/md";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";

interface Props {
  isLocalStream: boolean;
  stream: MediaStream;
  isOnCall: boolean;
  isMicOn: boolean;
  isCameraOn: boolean;
}

const VideoContainer = ({
  isLocalStream,
  stream,
  isOnCall,
  isCameraOn,
  isMicOn,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }

    return () => {};
  }, [stream]);

  return (
    <div className="bg-slate-500 absolute bg-opacity-70 w-screen h-screen top-0 bottom-0 flex items-center justify-center">
      <div className="bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4">
        <video
          ref={videoRef}
          className="rounder border w-[800px]"
          autoPlay
          playsInline
          muted={isLocalStream}
        />
        <div className="flex justify-around items-center w-full p-10">
          <button className="w-10 h-10 bg-red-500 flex items-center justify-center text-white rounded-full">
            <MdCallEnd size={24} />
          </button>

          <button className="w-10 h-10 bg-slate-500 flex items-center justify-center text-white rounded-full">
            {isMicOn ? <MdMic size={24} /> : <MdMicOff size={24} />}
          </button>

          <button className="w-10 h-10 bg-slate-500 flex items-center justify-center text-white rounded-full">
            {isCameraOn ? (
              <IoVideocam size={24} />
            ) : (
              <IoVideocamOff size={24} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
