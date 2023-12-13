import { io, Socket } from "socket.io-client";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Input, Button, List, Avatar, Row, Col, Spin } from "antd";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { ArrowRightOutlined, ArrowUpOutlined } from "@ant-design/icons";
import DateSeparator from "../../components/DateSeperator";
import Message from "../../components/Message";
import { socket } from "../../layouts/PatientLayout";

const { TextArea } = Input;

interface Message {
  author: string;
  message: string;
}

const Chat = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { id } = useParams<{ id: string }>();

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (!token) return;

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.emit("direct-chat-history", {
      receiverUserId: id,
    });

    socket.on("direct-chat-history", (data: any) => {
      if (data && data.messages) {
        const { messages, participants } = data;
        const transformedMessages: Message[] = messages?.map(
          (message: any) => ({
            author:
              message.authorType === "Patient" ? "You" : message.author.Name,
            message: message.content,
            createdAt: message.createdAt,
          })
        );
        setMessages(transformedMessages);
      }
    });
    socket.on("direct-message", (data: any) => {
      const { newMessage } = data;
      const message: any = {
        author:
          newMessage.authorType === "Patient" ? "You" : newMessage.author.Name,
        message: newMessage.content,
        createdAt: newMessage.createdAt,
      };
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    scrollToBottom();
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sendMessage = () => {
    if (inputValue.trim() !== "" && token) {
      const newMessage: any = {
        author: "You",
        message: inputValue,
        createdAt: new Date(),
      };
      socket.emit("direct-message", {
        receiverUserId: id,
        message: inputValue,
      });
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      ref={scrollRef}
      style={{ margin: "20px", paddingBottom: "70px", position: "relative" }}
    >
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "45vh" }}>
          <Spin size="large" />
          <p style={{ marginTop: "2vh" }}>Loading messages...</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => {
            const thisMessageDate = new Date(message.createdAt).toDateString();
            const prevMessageDate =
              index > 0 &&
              new Date(messages[index - 1]?.createdAt).toDateString();
            const isSameDay =
              index > 0 ? thisMessageDate === prevMessageDate : true;
            const incomingMessage = message.author !== "You";

            return (
              <div key={message._id} style={{ width: "97%" }}>
                {(!isSameDay || index === 0) && (
                  <DateSeparator date={message.createdAt} />
                )}
                <Message
                  content={message.message}
                  username={message.author}
                  sameAuthor={!incomingMessage}
                  date={message.createdAt}
                  incomingMessage={incomingMessage}
                />
              </div>
            );
          })}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              width: "137vh",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#eee",
              borderRadius: "2rem",
            }}
          >
            <TextArea
              rows={1}
              bordered={true}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                marginRight: "1vh",
                width: "130vh",
                borderRadius: "1rem",
              }}
            />
            <Button
              icon={<ArrowRightOutlined />}
              type="primary"
              onClick={sendMessage}
              shape="circle"
            ></Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
