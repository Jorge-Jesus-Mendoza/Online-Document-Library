import { useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  OngoingCall,
  PeerData,
  SocketUser,
  participants,
} from "../types/SocketUser";
import Peer, { SignalData } from "simple-peer";

interface iSocketContext {
  OnlineUsers: SocketUser[] | null;
  handleCall: (user: SocketUser) => void;
  OngoingCall: OngoingCall | null;
  peer: PeerData | null;
  localStream: MediaStream | null;
  handleJoinCall: (OngoingCall: OngoingCall) => void;
}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();
  const [OnlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<PeerData | null>(null);

  const userLogged = OnlineUsers?.find(
    (SockUser) => SockUser?.id === session?.user?.id
  );

  const [OngoingCall, setOngoingCall] = useState<OngoingCall | null>(null);

  const getMediaStream = useCallback(
    async (facemode?: string) => {
      if (localStream) {
        return localStream;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1240, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? facemode : undefined,
          },
        });
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.log("🚀 ~ getMediaStream ~ error:", error);
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  const handleCall = useCallback(
    async (user: SocketUser) => {
      if (!userLogged || !socket) return;

      const stream = await getMediaStream();

      if (!stream) {
        console.log("No stream in handleCall");
        return;
      }

      const participants: participants = {
        caller: userLogged,
        receiver: user,
      };

      setOngoingCall({
        isRinging: false,
        participants,
      });

      socket.emit("call", participants);
    },
    [getMediaStream, socket, userLogged]
  );

  const onIncomingCall = useCallback(
    (participants: participants) => {
      console.log("Llamada entrante recibida:", participants);
      setOngoingCall({ participants, isRinging: true });
    },
    // [socket, userLogged, OngoingCall]
    []
  );

  const handleHangUp = useCallback(({}) => {}, []);

  const createPeer = useCallback(
    (stream: MediaStream, initiator: boolean) => {
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.1.google.com:19302",
            "stun:stun1.1.google.com:19302",
            "stun:stun2.1.google.com:19302",
            "stun:stun3.1.google.com:19302",
          ],
        },
      ];

      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: { iceServers },
      });
      console.log("🚀 ~ peer.on ~ stream:", stream);

      peer.on("stream", (remoteStream) => {
        setPeer((prevPeer) => {
          if (prevPeer) {
            return { ...prevPeer, stream: remoteStream };
          } else {
            return prevPeer;
          }
        });
      });

      peer.on("error", console.error);
      peer.on("close", () => handleHangUp({}));

      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
      rtcPeerConnection.onconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection.iceConnectionState === "failed"
        ) {
          handleHangUp({});
        }
      };
      return peer;
    },
    [handleHangUp]
  );

  const completePeerConnection = useCallback(
    async (connectionData: {
      sdp: SignalData;
      OngoingCall: OngoingCall;
      isCaller: boolean;
    }) => {
      if (!localStream) {
        console.log("🚀 ~ Missing localStream");
        return;
      }

      if (peer) {
        console.log("Ya hay peer");
        peer.peerConnection?.signal(connectionData.sdp);
        return;
      }

      const newPeer = createPeer(localStream, true);
      setPeer({
        peerConnection: newPeer,
        participantUser: connectionData.OngoingCall.participants.receiver,
        stream: undefined,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("webrtcSignal", {
            sdp: data,
            OngoingCall,
            isCaller: true,
          });
        }
      });
    },
    [localStream, peer, createPeer, socket, OngoingCall]
  );

  const handleJoinCall = useCallback(
    async (OngoingCall: OngoingCall) => {
      setOngoingCall((prev) => {
        if (prev) {
          return { ...prev, isRinging: false };
        } else {
          return prev;
        }
      });
      const stream = await getMediaStream();
      if (!stream) {
        console.log("Could not get the stream in handleJoinCall");
        return;
      }

      const newPeer = createPeer(stream, true);
      setPeer({
        peerConnection: newPeer,
        participantUser: OngoingCall.participants.caller,
        stream: undefined,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("webrtcSignal", {
            sdp: data,
            OngoingCall,
            isCaller: false,
          });
        }
      });
    },

    [createPeer, getMediaStream, socket]
  );

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [session]);

  useEffect(() => {
    if (socket === null) return;

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("addNewUser", {
      id: session?.user?.id,
      profile: {
        name: session?.user?.name,
        image: session?.user?.image,
        email: session?.user?.email,
      },
      socketId: socket.id,
    });

    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getUsers", (res) => {
        setOnlineUsers(res);
      });
    };
  }, [socket, isConnected, session]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    try {
      socket.on("incomingCall", onIncomingCall);
      socket.on("webrtcSignal", completePeerConnection);
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
    }

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", completePeerConnection);
    };
  }, [isConnected, socket, onIncomingCall, completePeerConnection]);

  return (
    <SocketContext.Provider
      value={{
        peer,
        handleJoinCall,
        localStream,
        OngoingCall,
        handleCall,
        OnlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === null) {
    throw new Error("useSocket mus be used within a SocketProvider");
  } else {
    return context;
  }
};
