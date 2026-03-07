import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title = "Confirm", content, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="inherit">Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">Delete</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
