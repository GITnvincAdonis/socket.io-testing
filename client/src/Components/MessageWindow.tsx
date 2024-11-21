import { useEffect, useState } from "react";
import "./messageStyles.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log(`${socket.id} : connection ID`);
});

type Messages = {
  text: string;
};
export default function MessageWindow() {
  const [messages, setMessages] = useState<Messages[]>([]);

  function AddToTextList(textString: string) {
    const message: Messages = { text: textString };
    setMessages((prev) => [...prev, message]);
  }
  useEffect(() => {
    const handleServerMessage = (string: string) => {
      console.log(`${string} : from server`);
      AddToTextList(string);
    };

    socket.on("server-message", handleServerMessage);
    return () => {
      socket.off("server-message", handleServerMessage);
    };
  }, []);
  return (
    <>
      <div className="window-wrapper">
        <div className="text-area">
          {messages.map((item, index) => {
            return (
              <div key={index} className="message">
                {item.text}
              </div>
            );
          })}
        </div>

        <TextInterfaceButton
          buttontext="SEND"
          callbackFunction={AddToTextList}
          placeholder="Enter Message"
        ></TextInterfaceButton>
      </div>
    </>
  );
}

function TextInterfaceButton(props: {
  className?: string;
  buttontext: string;
  callbackFunction: CallableFunction;
  placeholder: string;
}) {
  const { className, buttontext, callbackFunction, placeholder } = props;
  const [textIn, setTextIn] = useState("");
  const [roomID, setRoom] = useState("");
  return (
    <>
      <div className={className}>
        {" "}
        <input
          type="text"
          className="p-1"
          placeholder={placeholder}
          onChange={(e) => {
            setTextIn(e.target.value || "");
          }}
        />
        <button
          className="p-1 mx-1"
          onClick={() => {
            socket.emit("button-click-Event", `${textIn}`, roomID);
            callbackFunction(textIn);
          }}
        >
          {buttontext}
        </button>
      </div>
      <div className={className}>
        {" "}
        <input
          type="text"
          className="p-1"
          placeholder="join room"
          onChange={(e) => {
            setRoom(e.target.value || "");
          }}
        />
        <button
          className="p-1 mx-1"
          onClick={() => {
            socket.emit("join-room", roomID);
            console.log("set room id");
          }}
        >
          {"join"}
        </button>
      </div>
    </>
  );
}
