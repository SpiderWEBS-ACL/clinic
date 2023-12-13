import React, { useEffect, useRef, useState } from "react";
import Peer, { SignalData } from "simple-peer";
import Button from "@material-ui/core/Button";
import "../../App.css";
import { socket } from "../../layouts/PatientLayout";

const VideoChat: React.FC = () => {
  const [me, setMe] = useState<string>("");
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
      });
    setMe("" + localStorage.getItem("socketId"));
    socket.on("callUser", (data: any) => {
      console.log("calling " + data.from);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);
  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream as MediaStream,
    });
    peer.on("signal", (data: SignalData) => {
      socket.emit("callUser", {
        userToCall: id,
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
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream as MediaStream,
    });
    peer.on("signal", (data: SignalData) => {
      console.log("data: " + data + " to: " + caller);
      socket.emit("answerCall", { signal: data, to: caller });
      // setRemoteStream(stream); //TODO:
    });
    peer.on("stream", (stream) => {
      console.log("userVideo.current: " + userVideo.current);
      if (userVideo.current) userVideo.current.srcObject = stream;
      setRemoteStream(stream);
    });
    peer.signal(callerSignal as SignalData);
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
          {callAccepted && remoteStream && !callEnded && (
            <video
              ref={(ref) => handleVideoLoaded(ref, remoteStream)}
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
        {receivingCall && !callAccepted && (
          <div
            className="caller"
            style={{ marginBottom: "20px", color: "#000" }}
          >
            <h1>Doctor is calling...</h1>
            <Button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </Button>
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

export default VideoChat;
