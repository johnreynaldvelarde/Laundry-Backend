import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  DialogContent,
} from "@mui/material";
import { COLORS } from "../../../../constants/color";
import useFetchData from "../../../../hooks/common/useFetchData";
import {
  createMessageSenderCustomer,
  getChatMessages,
} from "../../../../services/api/customerApi";
import { decryptMessage, encryptMessage } from "../../../../utils/messages";
import start_conversation from "../../../../assets/images/start_convo.png";
import { createMessageSenderAdmin } from "../../../../services/api/postApi";

const CustomMessage = ({ selectedMessage, userId }) => {
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { data: messages, fetchData: fetchMessages } = useFetchData();

  const fetchMessagesData = useCallback(async () => {
    if (!selectedMessage) return;
    setLoading(true);
    try {
      await fetchMessages(
        getChatMessages.getMessages,
        userId,
        selectedMessage.id
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchMessages, userId, selectedMessage]);

  useEffect(() => {
    fetchMessagesData();
    const intervalId = setInterval(() => {
      fetchMessagesData();
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchMessagesData]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1); // -1 to account for minor scroll differences
  };

  useEffect(() => {
    const chatArea = document.getElementById("chatArea");
    if (chatArea && isAtBottom) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages, isAtBottom]); // Trigger scroll to bottom when messages or scroll state change

  if (!selectedMessage) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: COLORS.secondary,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "10px",
          maxHeight: "700px",
        }}
      >
        <Typography>No message selected</Typography>
      </Box>
    );
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      console.log(newMessage);
      try {
        const encryptedMessage = await encryptMessage(newMessage);
        const messageData = {
          sender_id: userId,
          recipient_id: selectedMessage.id,
          message: encryptedMessage,
        };

        console.log(messageData);
        const response = await createMessageSenderAdmin.setCustomerMessageAdmin(
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${COLORS.border}`,
        borderRadius: "10px",
        height: "100%",
        maxHeight: "700px",
      }}
    >
      {/* Chat header */}
      <Box
        sx={{
          borderBottom: `1px solid ${COLORS.border2}`,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Avatar
          sx={{ marginRight: "10px" }}
          // src={`https://randomuser.me/api/portraits/${
          //   selectedMessage?.role === "Customer" ? "women" : "men"
          // }/${selectedMessage?.id}.jpg`}
          alt={selectedMessage?.name}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold" color={COLORS.secondary}>
            {selectedMessage?.name || "Unknown Sender"}
          </Typography>
          <Typography variant="body1" color={COLORS.primary}>
            {selectedMessage?.role || "Unknown Role"}
          </Typography>
        </Box>
      </Box>

      {/* Chat messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          marginBottom: 1,
        }}
      >
        <DialogContent
          style={{
            height: "calc(100% - 64px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            id="chatArea"
            className="flex flex-col flex-grow rounded p-2 max-h-[400px] md:max-h-[500px] overflow-y-auto"
            onScroll={handleScroll}
            style={{
              position: "relative",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {messages.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-lg">
                <img
                  src={start_conversation}
                  alt="Start a conversation"
                  className="mb-4 max-w-[200px] w-full h-auto sm:max-w-[300px] md:max-w-[400px]"
                />
                <span>Start a conversation</span>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isSentByUser = msg.sender_id === userId; // Check if the message is sent by the user
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
        </DialogContent>
      </Box>

      {/* Message input */}
      <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <TextField
          label="Type a message"
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
      </Box>
    </Box>
  );
};

export default CustomMessage;
