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
    <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>{title}</DialogTitle>
    <DialogContent sx={{ pt: { xs: 2, sm: 1.5 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>{content}</DialogContent>
    <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: 1 }}>
      <Button onClick={onCancel} color="inherit" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Delete</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
