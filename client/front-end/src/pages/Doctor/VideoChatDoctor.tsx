import React, { useEffect, useRef, useState } from "react";
import Peer, { SignalData } from "simple-peer";
import { io, Socket } from "socket.io-client";
import Button from "@material-ui/core/Button";
import "../../App.css";
import { useParams } from "react-router-dom";
import { getPatientInfoApi } from "../../apis/Doctor/Patients/GetPatientInfo";

const socket: Socket = io("http://localhost:8000");

const VideoChatDoctor: React.FC = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [caller, setCaller] = useState<string>("");
  const [callerSignal, setCallerSignal] = useState<SignalData>();
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [idToCall, setIdToCall] = useState<string>("");
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance>();
  const [patientInfo, setPatientInfo] = useState<any>({});
  const { id } = useParams();

  let patientVideoSocketId = "";
  let me = "";

  const handleVideoLoaded = (
    videoElement: HTMLVideoElement | null,
    stream: MediaStream | undefined
  ) => {
    if (videoElement && stream) {
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        videoElement.play();
      };
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        setRemoteStream(stream);
      });
    socket.on("me", (id: string) => {
      me = id;
      getPatientInfoAndCall(id);
    });

    socket.on("callUser", (data: any) => {
      console.log("calling " + data.from);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    return () => {
      if (!callEnded) {
        leaveCall();
      }
    };
  }, []);
  const getPatientInfoAndCall = async (me: any) => {
    await getPatientInfoApi(id)
      .then((response) => {
        console.log(response.data.VideoSocketId);
        setPatientInfo(response.data);
        patientVideoSocketId = response.data.VideoSocketId;
        console.log(patientVideoSocketId);
        callUser(me);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const callUser = (me: any) => {
    console.log("entered call user user to call: " + patientVideoSocketId);
    console.log("me: " + me);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream as MediaStream,
    });
    peer.on("signal", (data: SignalData) => {
      socket.emit("callUser", {
        userToCall: patientVideoSocketId,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      console.log("userVideo.current: " + userVideo.current);
      if (userVideo.current) userVideo.current.srcObject = stream;
      setRemoteStream(stream);
    });
    socket.on("callAccepted", (signal: SignalData) => {
      console.log("call Answered: ");
      setRemoteStream(stream); //TODO:
      setCallAccepted(true);
      peer.signal(signal);
    });
    socket.on("callEnded", () => {
      setCallEnded(true);
      leaveCall();
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    socket.emit("callEnded");
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    socket.disconnect();
    if (stream) {
      setStream(undefined);
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(undefined);
    }
  };
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 style={{ textAlign: "center", color: "#000" }}>Video Call</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <div style={{ width: "450px", margin: "10px" }}>
          {stream && (
            <video
              ref={(ref) => handleVideoLoaded(ref, stream)}
              playsInline
              muted
              autoPlay
              style={{ width: "100%", borderRadius: "8px" }}
            />
          )}
        </div>
        <div style={{ width: "450px", margin: "10px" }}>
          {callAccepted && stream && !callEnded && (
            //TODO:
            <video
              ref={(ref) => handleVideoLoaded(ref, stream)} //TODO:
              playsInline
              autoPlay
              style={{ width: "100%", borderRadius: "8px" }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {!callEnded && !callAccepted && (
          <div
            className="caller"
            style={{ marginBottom: "20px", color: "#000" }}
          >
            <h1>
              {name} calling {patientInfo.Name}...
            </h1>
          </div>
        )}
        {callAccepted && !callEnded && (
          <Button variant="contained" color="secondary" onClick={leaveCall}>
            End Call
          </Button>
        )}
        {callEnded && (
          <div
            className="caller"
            style={{ marginBottom: "20px", color: "#f00" }}
          >
            <h1>Call Ended</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoChatDoctor;
