import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { Input, Button, Spin } from "antd";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import DateSeparator from "../../components/DateSeperator";
import Message from "../../components/message";

const { TextArea } = Input;

interface Message {
  author: string;
  authorId: string;
  message: string;
}

const ChatDoctor = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const socket: Socket = io("http://localhost:8000", {
    auth: {
      token: Cookies.get("accessToken"),
    },
  });

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
      const { messages, participants } = data;
      const transformedMessages: Message[] = messages.map((message: any) => ({
        authorId: message.author._id,
        author: message.authorType === "Doctor" ? "You" : message.author.Name,
        message: message.content,
        createdAt: message.createdAt,
      }));
      setMessages(transformedMessages);
      setLoading(false);
    });

    socket.on("direct-message", (data: any) => {
      const { newMessage } = data;
      const message: any = {
        author:
          newMessage.authorType === "Doctor" ? "You" : newMessage.author.Name,
        message: newMessage.content,
        createdAt: newMessage.createdAt,
      };
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.trim() !== "" && token) {
      const newMessage: any = {
        author: "You",
        authorId: `${localStorage.getItem("id")}`,
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
              width: "145vh",
              alignItems: "center",
              padding: "10px",
              backgroundColor: "#eee",
            }}
          >
            <TextArea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{ marginRight: "10px", width: "135vh" }}
            />
            <Button
              icon={<ArrowRightOutlined />}
              type="primary"
              style={{ marginRight: "10px" }}
              onClick={sendMessage}
            ></Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatDoctor;
