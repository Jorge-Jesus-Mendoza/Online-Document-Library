import { io } from "../server.js";

const onWebRtcSignal = async(data) => {
    if(data.isCaller){

        console.log("emitido al receptor con socketId: ", data.OngoingCall.participants.receiver.socketId)
        if(data.OngoingCall.participants.receiver.socketId){
            io.to(data.OngoingCall.participants.receiver.socketId).emit('webrtcSignal',
                data
            )
        }

    }else{
        if(data.OngoingCall.participants.caller.socketId){
        console.log("emitido al emisor con socketId: ", data.OngoingCall.participants.caller.socketId)
            io.to(data.OngoingCall.participants.caller.socketId).emit('webrtcSignal',
                data
            )
        }
    }
}

export default onWebRtcSignal