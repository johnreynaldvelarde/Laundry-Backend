import { useState, useEffect, useCallback } from "react";
import { axiosPrivate } from "../../api/axios";

const useMessages = (userId) => {
  const [inbox, setInbox] = useState([]); // List of inbox conversations
  const [selectedConversation, setSelectedConversation] = useState(null); // Selected conversation details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch inbox conversations
  const fetchInbox = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(`/inbox/${userId}/get-inbox`);

      setInbox(response.data.data);

      setError(null);
    } catch (err) {
      console.error("Failed to fetch inbox:", err);
      setError("Could not load inbox");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch conversation details when a conversation is selected
  const fetchConversation = useCallback(async (conversationId) => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get(
        `/inbox/${conversationId}/get-messages`
      );
      const messages = response.data.data; // Assuming data contains messages array
      setSelectedConversation({
        conversation_id: conversationId,
        messages,
      });
      setError(null);
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
      setError("Could not load conversation");
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle selecting a conversation from the inbox
  const selectConversation = (conversationId) => {
    fetchConversation(conversationId); // Fetch the selected conversation
  };

  // Load inbox on initial render
  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  return {
    inbox,
    selectedConversation,
    loading,
    error,
    selectConversation,
  };
};

export default useMessages;
