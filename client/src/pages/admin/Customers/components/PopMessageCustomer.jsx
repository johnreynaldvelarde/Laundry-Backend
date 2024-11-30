import React, { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, TextField, Button } from "@mui/material";
import {
  createMessageSenderCustomer,
  getChatMessages,
  updateMessageisRead,
} from "../../../../services/api/customerApi";
import { decryptMessage, encryptMessage } from "../../../../utils/messages";
import useAuth from "../../../../contexts/AuthContext";
import useFetchData from "../../../../hooks/common/useFetchData";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";
import { COLORS } from "../../../../constants/color";
import start_convo from "../../../../assets/images/start_convo.png";

const PopMessageCustomer = ({ open, onClose, id, name, refreshData }) => {
  const { userDetails } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true); // Track if at the bottom

  const { data: messages, fetchData: fetchMessages } = useFetchData();
  const { data: isRead, fetchData: fetchUpdateMessageRead } = useFetchData();

  const fetchMessagesData = useCallback(() => {
    fetchMessages(getChatMessages.getMessages, userDetails.userId, id);
  }, [fetchMessages, userDetails.userId, id]);

  const fetchUpdateMessageReadData = useCallback(async () => {
    fetchUpdateMessageRead(
      updateMessageisRead.putMessageisRead,
      userDetails.userId,
      id
    );
  }, [fetchUpdateMessageRead, userDetails.userId, id]);

  useEffect(() => {
    fetchMessagesData();
    fetchUpdateMessageReadData();
    const intervalId = setInterval(() => {
      fetchMessagesData();
      fetchUpdateMessageReadData();
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchMessagesData, fetchUpdateMessageReadData]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight);
  };

  useEffect(() => {
    const chatArea = document.getElementById("chatArea");
    if (open && chatArea) {
      // Check if chatArea exists
      if (isAtBottom) {
        chatArea.scrollTop = chatArea.scrollHeight; // Scroll to bottom
      }
    }
  }, [messages, open, isAtBottom]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const encryptedMessage = await encryptMessage(newMessage);

        const messageData = {
          sender_id: userDetails.userId,
          recipient_id: id,
          message: encryptedMessage,
        };
        const response = await createMessageSenderCustomer.setCustomerMessage(
          messageData
        );
        if (response && response.success) {
          setNewMessage("");
        } else {
          console.error("Message failed to send", response);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("Cannot send an empty message.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          height: "600px",
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={
          <span>
            Chat with{" "}
            <span style={{ fontWeight: 600, color: COLORS.secondary }}>
              {name}
            </span>
          </span>
        }
        subtitle={"Send your inquiries or updates"}
        onClose={onClose}
      />

      <DialogContent
        style={{
          padding: "16px",
          height: "calc(100% - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chat Area with Background Color */}
        <div
          id="chatArea"
          className="flex flex-col flex-grow rounded p-2 max-h-[400px] md:max-h-[500px] overflow-y-auto"
          onScroll={handleScroll}
          style={{
            backgroundColor: COLORS.background,
            borderRadius: 8,
            position: "relative",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {messages.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-lg">
              <img
                src={start_convo}
                alt="Start a conversation"
                className="mb-2 w-40 h-32"
              />
              <span style={{ color: COLORS.secondary }}>
                Start a conversation
              </span>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isSentByUser = msg.sender_id === userDetails.userId; // Check if the message is sent by the user
              const decryptedMessage = decryptMessage(msg.message); // Decrypt the message

              return (
                <div
                  key={index}
                  className={`my-2 p-2 rounded ${
                    isSentByUser
                      ? "bg-[#5787C8] text-white self-end"
                      : "bg-gray-300 text-[#393939] self-start"
                  } max-w-[75%] md:max-w-[60%] break-words`}
                >
                  <p className="text-sm md:text-base">{decryptedMessage}</p>
                </div>
              );
            })
          )}
        </div>
        {/* Message Input */}
        <div className="flex mt-4">
          <TextField
            label="Send a message"
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button
            disableElevation
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{
              marginLeft: 1,
              textTransform: "none",
              backgroundColor: COLORS.secondary,
              "&:hover": {
                backgroundColor: COLORS.secondaryHover,
              },
            }}
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopMessageCustomer;
