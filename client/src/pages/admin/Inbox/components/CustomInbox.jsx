import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import { COLORS } from "../../../../constants/color";
import no_message from "../../../../assets/images/no_data_table.jpg";
import useFetchData from "../../../../hooks/common/useFetchData";
import { getInboxAdmin } from "../../../../services/api/getApi";
import { decryptMessage } from "../../../../utils/messages";

import avatar_1 from "../../../../assets/images/d_profile1.png";
import avatar_2 from "../../../../assets/images/d_profile2.png";
import avatar_3 from "../../../../assets/images/d_profile3.png";
import avatar_4 from "../../../../assets/images/d_profile4.png";

const avatars = [avatar_1, avatar_2, avatar_3, avatar_4];

const getRandomAvatar = () =>
  avatars[Math.floor(Math.random() * avatars.length)];

const UserList = ({ title, users, onSelectMessage, selectedMessage }) => (
  <Box mt={1}>
    <Typography
      variant="h6"
      sx={{
        marginTop: "16px",
        fontWeight: "bold",
        color: COLORS.secondary,
      }}
    >
      {title}
    </Typography>
    <List>
      {users.length > 0 ? (
        users.map((message, index) => {
          const decryptedMessage = decryptMessage(message.message); // Decrypt the message here

          return (
            <React.Fragment key={message.id}>
              <ListItem
                component="button"
                onClick={() => onSelectMessage(message)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor:
                    selectedMessage?.id === message.id
                      ? COLORS.secondaryLight
                      : "transparent",
                }}
              >
                <Avatar
                  sx={{ marginRight: 1 }}
                  // src={getRandomAvatar}
                  // src={`https://randomuser.me/api/portraits/${
                  //   message.role === "Customer" ? "women" : "men"
                  // }/${message.id}.jpg`}
                  alt={message.name}
                />
                <ListItemText
                  primary={message.name}
                  secondary={
                    <Typography
                      sx={{ color: COLORS.primary }}
                      // sx={{
                      //   color:
                      //     message.is_read === 0 ? COLORS.text : COLORS.subtitle, // Highlight the message text if unread
                      //   fontWeight: message.is_read === 0 ? "bold" : "normal",
                      // }}
                    >
                      {decryptedMessage || "Start a conversation"}
                    </Typography>
                  }
                  sx={{
                    marginRight: "auto",
                    paddingRight: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  textAlign={"right"}
                  sx={{ color: COLORS.secondary, whiteSpace: "nowrap" }}
                >
                  {message.timestamp}
                </Typography>
              </ListItem>
              {index < users.length - 1 && <Divider />}
            </React.Fragment>
          );
        })
      ) : (
        <EmptyState message={`No ${title}`} />
      )}
    </List>
  </Box>
);

const EmptyState = ({ message }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height: "100px",
      textAlign: "center",
      padding: 10,
    }}
  >
    <img
      src={no_message}
      alt={message}
      style={{
        width: "100px",
        height: "auto",
      }}
    />
    <Typography variant="body2" sx={{ color: COLORS.primary }}>
      {message}
    </Typography>
  </Box>
);

const CustomInbox = ({ onSelectMessage, selectedMessage, userId }) => {
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);

  const { data: inbox, fetchData: fetchInbox } = useFetchData();

  const fetchInboxData = useCallback(async () => {
    setLoading(true);
    await fetchInbox(getInboxAdmin.viewInboxAdmin, userId);
    setLoading(false);
  }, [fetchInbox]);

  useEffect(() => {
    fetchInboxData();
    const intervalId = setInterval(() => {
      fetchInboxData();
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchInboxData]);

  useEffect(() => {
    if (inbox.length > 0 && !selectedMessage) {
      onSelectMessage(inbox[0]);
    }
  }, [selectedMessage, onSelectMessage]);

  const filteredMessages = inbox.filter((message) =>
    message.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const users = filteredMessages.filter(
    (message) =>
      message.role === "Administrator" ||
      message.role === "Manager" ||
      message.role === "Delivery Staff" ||
      message.role === "Store Staff"
  );

  const customers = filteredMessages.filter(
    (message) => message.role === "Customer"
  );

  const sortedUsers = [...users].sort((a, b) =>
    a.message && !b.message ? -1 : 1
  );
  const sortedCustomers = [...customers].sort((a, b) =>
    a.message && !b.message ? -1 : 1
  );

  return (
    <Box
      sx={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "700px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          padding: "16px",
          fontWeight: "bold",
          color: COLORS.secondary,
        }}
      >
        All Messages
      </Typography>
      <Divider />
      <TextField
        variant="outlined"
        placeholder="Search name..."
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        sx={{
          margin: "16px",
          borderRadius: "8px",
          width: "calc(100% - 32px)",
          boxSizing: "border-box",
        }}
      />

      <Box
        className="scrollables"
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "0 20px",
          maxHeight: "calc(700px - 128px)",
        }}
      >
        <UserList
          title="Users in Store"
          users={sortedUsers}
          onSelectMessage={onSelectMessage}
          selectedMessage={selectedMessage}
        />
        <UserList
          title="Customers"
          users={sortedCustomers}
          onSelectMessage={onSelectMessage}
          selectedMessage={selectedMessage}
        />
      </Box>
    </Box>
  );
};

export default CustomInbox;
