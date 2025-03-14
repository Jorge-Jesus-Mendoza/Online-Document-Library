import { User } from "@prisma/client";
import Peer from "simple-peer";

export interface SocketUser {
  id: string;
  socketId: string;
  profile: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export interface OngoingCall {
  participants: participants;
  isRinging: boolean;
}

export interface participants {
  caller: SocketUser;
  receiver: SocketUser;
}

export interface PeerData {
  peerConnection: Peer.Instance;
  stream: MediaStream | undefined;
  participantUser: SocketUser;
}
