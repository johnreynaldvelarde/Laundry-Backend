import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Rating,
} from "@mui/material";
import CustomPopHeaderTitle from "../../../components/common/CustomPopHeaderTitle";
import CustomPopFooterButton from "../../../components/common/CustomPopFooterButton";
import useAuth from "../../../contexts/AuthContext";
import { COLORS } from "../../../constants/color";
import { createFeedbackAndReview } from "../../../services/api/customerApi";
import toast from "react-hot-toast";

const PopFeedbackAndReview = ({
  open,
  onClose,
  userId,
  storeId,
  serviceRequest,
  onFeedbackSubmit,
}) => {
  const { userDetails } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const Clear = () => {
    setFeedback("");
    setRating(0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        store_id: userDetails.storeId,
        user_id: userDetails.userId,
        service_request_id: serviceRequest,
        rating: rating,
        comment: feedback,
      };
      const response = await createFeedbackAndReview.setFeedbackReview(data);
      if (response.success) {
        toast.success(response.message);
        onFeedbackSubmit();
        onClose();
      } else {
        toast.error(response.message);
      }
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to submit feedback. Please try again." });
    } finally {
      setLoading(false);
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
        },
      }}
    >
      {/* Header */}
      <CustomPopHeaderTitle
        title={"Leave Feedback and Review"}
        subtitle={"Rate your experience and provide feedback"}
        onClose={onClose}
      />

      {/* Dialog Content */}
      <DialogContent>
        {/* Star Rating */}
        <div className="mb-4">
          <h4 className="font-semibold" style={{ color: COLORS.secondary }}>
            Rate your experience:
          </h4>
          <Rating
            name="user-rating"
            size="large"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </div>

        {/* Feedback Text Field */}
        <TextField
          label="Your Feedback"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          fullWidth
          variant="outlined"
          margin="dense"
        />
      </DialogContent>

      {/* Footer */}
      <CustomPopFooterButton
        label={"Submit"}
        onClose={onClose}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </Dialog>
  );
};

export default PopFeedbackAndReview;
