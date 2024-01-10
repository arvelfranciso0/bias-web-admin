import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
function ChatComponent(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const chatroom_id = searchParams.get("chat_room");
  const user_id = searchParams.get("u");
  const [chatroom, setChatRoom] = useState([]);
  const [btnClick, setBtnClick] = useState(false);
  const [messagesList, setMessagesList] = useState([]);
  const [message, setMessage] = useState("");
  const chatContainer = useRef(null);
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/getChatRooms`, {
        adminId: 10,
      })
      .then((res) => {
        setChatRoom(res.data.result);
        console.log(res.data.result);
      })
      .catch((error) => {
        if (error.response) {
          navigate("/server-error");
        } else if (error.request) {
          navigate("/error");
        } else {
          navigate("/somethingwrong");
        }
      });
  }, []);
  const fectMessage = () => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/admin/chatsmsgs`, {
        chatroom_id,
      })
      .then((res) => {
        // if (chatContainer.current) {
        //   chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
        // }
        setMessagesList(res.data.result);
      })
      .catch((error) => {
        if (error.response) {
          navigate("/server-error");
        } else if (error.request) {
          navigate("/error");
        } else {
          navigate("/somethingwrong");
        }
      });
  };

  useEffect(() => {
    fectMessage();

    const invtervalsend = setInterval(fectMessage, 2000);

    return () => clearInterval(invtervalsend);
  }, [user_id]);

  const handleSendMessage = () => {
    axios
      .post(`${process.env.REACT_APP_NETWORK_ADD}/api/create-chat-room`, {
        adminId: 10,
        user_id,
        content: message,
        senderId: 10,
      })
      .then((res) => {
        if (res.data.status) {
          setBtnClick(!btnClick);
          setMessage("");
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          navigate("/server-error");
        } else if (error.request) {
          navigate("/error");
        } else {
          navigate("/somethingwrong");
        }
      });
  };

  //   useEffect(() => {
  //     socket.on("recieve_user_list", (data) => {
  //       console.log(data);
  //     });
  //   }, [socket]);

  const handleGetListMessage = (id, user) => {
    navigate(`?chat_room=${id}&u=${user}`);
    // console.log(id);
    // const socketId = id; // Replace with the actual socket ID of the user
    // const messageContent = "Hello, user!"; // Replace with the actual message content
    // socket.emit("admin_message", { targetUserId: id, messageContent });
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="bg-light border" style={{ height: "90vh", width: "40%" }}>
        <label className="fw-bold bg-secondary w-100 p-2 d-flex justify-content-between align-items-center">
          Users{" "}
          <FontAwesomeIcon
            icon={faRotate}
            onClick={() => setBtnClick(!btnClick)}
          />
        </label>

        <div
          className="d-flex flex-column gap-2 p-3 rounded overflow-auto mt-2"
          style={{ height: "85vh", width: "80%" }}
        >
          {chatroom.map((item) => (
            <div
              className="w-100 bg-light border d-flex gap-2 rounded p-1"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleGetListMessage(item.chtroom_id, item.cht_user_id)
              }
              key={item.chtroom_id}
            >
              {item.user_profile ? (
                <img
                  src={item.user_profile}
                  className="rounded-circle"
                  style={{ width: "3rem", height: "3rem" }}
                />
              ) : (
                <span
                  className="bg-primary rounded-circle"
                  style={{ width: "3rem ", height: "3rem" }}
                ></span>
              )}

              <label className=" rounded w-50 fw-bold">{`${item.user_fname} ${item.user_lname}`}</label>
            </div>
          ))}
        </div>
      </div>
      <div
        className=" bg-light border"
        style={{ height: "90vh", width: "60%" }}
      >
        {" "}
        <label className="fw-bold bg-secondary w-100 p-2 d-flex justify-content-between align-items-center">
          Chat{" "}
          <FontAwesomeIcon
            icon={faRotate}
            onClick={() => setBtnClick(!btnClick)}
          />
        </label>
        <div
          className="d-flex flex-column-reverse gap-2 p-3 rounded overflow-auto mt-2 "
          style={{ height: "73vh", width: "100%" }}
          ref={chatContainer}
        >
          {messagesList ? (
            <>
              {messagesList.map((item) => (
                <div
                  className={`d-flex ${
                    item.chtmsg_sender_id === parseInt(10)
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                  key={item.chtmsg_id}
                >
                  <label
                    className={`w-50 rounded p-2 text-light ${
                      item.chtmsg_sender_id === parseInt(10)
                        ? "bg-primary"
                        : "bg-secondary"
                    }`}
                  >
                    {item.chtmsg_content}
                  </label>
                </div>
              ))}
              {/* <div className="d-flex justify-content-strt">
          <label className="right-0 bg-secondary rounded p-2  w-25">
            Hello
          </label>
        </div> */}
            </>
          ) : (
            ""
          )}
        </div>
        <div class="input-group mt-3 ps-3 pe-3">
          <input
            type="text"
            class="form-control"
            placeholder="Message"
            aria-describedby="button-addon2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            class="btn btn-primary"
            type="button"
            id="button-addon2"
            onClick={() => handleSendMessage()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
