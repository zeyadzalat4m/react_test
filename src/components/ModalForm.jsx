import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from '@mui/material';

function ModalForm({ open, title, children, onClose, onSave, saveLabel = 'Save', loading }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 1, display: 'grid', gap: 16 }}>
          {children}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" disabled={loading}>
          {saveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalForm;
