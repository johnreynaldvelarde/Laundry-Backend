import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { COLORS } from "../../../../constants/color";
import CustomPopHeaderTitle from "../../../../components/common/CustomPopHeaderTitle";

const PopNotes = ({ open, onClose, notes }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
        },
      }}
    >
      <CustomPopHeaderTitle
        title={"Notes"}
        subtitle={"Customer instructions for their clothes"}
        onClose={onClose}
      />

      <DialogContent>
        <TextField
          multiline
          rows={4} // Set the number of visible rows
          variant="outlined"
          fullWidth
          InputProps={{
            readOnly: true, // Makes the text field read-only
          }}
          value={notes ? notes : "No notes available."}
          sx={{ bgcolor: COLORS.background, borderRadius: "4px" }} // Optional styling
        />
      </DialogContent>
      <DialogActions>
        {/* You can add action buttons here if needed */}
      </DialogActions>
    </Dialog>
  );
};

export default PopNotes;
