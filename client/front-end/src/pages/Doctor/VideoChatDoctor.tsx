import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhoneIcon from "@material-ui/icons/Phone";
import Peer from "simple-peer";
import { socket } from "../../layouts/PatientLayout";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";

function videoChatDoctor() {
  const [me, setMe] = useState<string>("");
  const [callerName, setcallerName] = useState<string>(
    localStorage.getItem("DoctorName") + ""
  );

  const [stream, setStream] = useState<MediaStream | undefined>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [calling, setCalling] = useState<boolean>(false);
  const [caller, setCaller] = useState<string>("");
  const [callerSignal, setCallerSignal] = useState<
    Peer.SignalData | undefined
  >();
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [idToCall, setIdToCall] = useState<string>("");
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance>();
  const navigate = useNavigate();
  const { id } = useParams();

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
        console.log(myVideo.current);
        if (myVideo.current) {
          console.log(myVideo.current);
          myVideo.current.srcObject = stream;
        }
      });

    socket.on("me", (id: string) => {
      console.log(id);
      setMe(id);
    });

    socket.on(
      "callUser",
      (data: { from: string; name: string; signal: Peer.SignalData }) => {
        setReceivingCall(true);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
      }
    );
    socket.on("endCall", () => {
      console.log("in End Call");
      setCallEnded(true);
      message.info("Call Ended! ");
      navigate("/doctor/Home");
    });
    // socket.on("inLobby", () => {
    //   console.log("HERE???");
    //   console.log(connectionRef);
    //   connectionRef.current?.on("signal", (data) => {
    //     console.log("HERE?");
    //     socket.emit("callUser", {
    //       userToCall: id,
    //       signalData: data,
    //       from: me,
    //       name: callerName,
    //     });
    //   });
    //   connectionRef.current?.on("stream", (stream) => {
    //     console.log("userVideo.current: " + userVideo.current);
    //     if (userVideo.current) userVideo.current.srcObject = stream;
    //     setRemoteStream(stream);
    //   });
    //   socket.on("callAccepted", (signal: Peer.SignalData) => {
    //     setCallAccepted(true);
    //     connectionRef.current?.signal(signal);
    //   });
    // });
  }, []);

  // useEffect(() => {
  //   socket.on("inLobby", () => {
  //     console.log("HERE???");
  //     console.log(connectionRef);
  //     connectionRef.current?.on("signal", (data) => {
  //       console.log("HERE?");
  //       socket.emit("callUser", {
  //         userToCall: id,
  //         signalData: data,
  //         from: me,
  //         name: callerName,
  //       });
  //     });
  //     connectionRef.current?.on("stream", (stream) => {
  //       console.log("userVideo.current: " + userVideo.current);
  //       if (userVideo.current) userVideo.current.srcObject = stream;
  //       setRemoteStream(stream);
  //     });
  //     socket.on("callAccepted", (signal: Peer.SignalData) => {
  //       setCallAccepted(true);
  //       connectionRef.current?.signal(signal);
  //     });
  //   });
  // }, [connectionRef, id, me, callerName, userVideo]);

  const callUser = (id: string) => {
    setCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: callerName,
      });
    });
    peer.on("stream", (stream) => {
      console.log("userVideo.current: " + userVideo.current);
      if (userVideo.current) userVideo.current.srcObject = stream;
      setRemoteStream(stream);
    });
    socket.on("callAccepted", (signal: Peer.SignalData) => {
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
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: id });
    });
    peer.on("stream", (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
      setRemoteStream(stream);
    });

    if (callerSignal) {
      peer.signal(callerSignal);
    }
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    socket.emit("endCall", { to: id });
  };

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#111" }}>Video Call</h1>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream && (
              <video
                playsInline
                muted
                ref={(ref) => handleVideoLoaded(ref, stream)}
                autoPlay
                style={{ marginLeft: 0, width: "450px" }}
              />
            )}
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video
                playsInline
                ref={(ref) => handleVideoLoaded(ref, remoteStream)}
                autoPlay
                style={{ width: "450px" }}
              />
            ) : null}
          </div>
        </div>
        <div className="myId">
          {callAccepted && !callEnded ? (
            <Button variant="contained" color="secondary" onClick={leaveCall}>
              End Call
            </Button>
          ) : (
            <IconButton
              color="primary"
              aria-label="call"
              onClick={() => callUser(id + "")}
            >
              <PhoneIcon fontSize="large" />
            </IconButton>
          )}
          {idToCall}
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{callerName} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
          {calling && !callAccepted ? (
            <div className="caller">
              <h1>calling {localStorage.getItem("PatientName") + "..."}</h1>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default videoChatDoctor;
