"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../../../../context/SocketContext";
import VideoContainer from "./VideoContainer";

const VideoCall = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const { OngoingCall, peer, localStream } = useSocket();
  // console.log("🚀 ~ VideoCall ~ peer:", peer);
  // console.log("🚀 ~ VideoCall ~ localStream:", localStream);

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      setIsVideoOn(videoTrack.enabled);
      const audioTrack = localStream.getAudioTracks()[0];
      setIsMicOn(audioTrack.enabled);
    }

    return () => {};
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const isOnCall = OngoingCall && peer && localStream ? true : false;

  return (
    <>
      {localStream && (
        <VideoContainer
          isCameraOn={isVideoOn}
          isMicOn={isMicOn}
          stream={localStream}
          isLocalStream={true}
          isOnCall={isOnCall}
        />
      )}

      {peer && peer.stream && (
        <VideoContainer
          isCameraOn={isVideoOn}
          isMicOn={isMicOn}
          stream={peer.stream}
          isLocalStream={false}
          isOnCall={isOnCall}
        />
      )}
    </>
  );
};

export default VideoCall;
