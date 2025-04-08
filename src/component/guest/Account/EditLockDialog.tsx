import { encryptData } from '@/lib/encryption';
import { showToast } from '@/lib/toastify/showToast';
import { Button, Dialog } from '@mantine/core';
import { DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material';
import { useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockOutlineIcon from '@mui/icons-material/Lock';
export interface IEditLockDialogProps {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  password: string;
}
export const EditLockDialog = ({ edit, setEdit, password }: IEditLockDialogProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const closeCleanup = () => {
    setOpenDialog(false);
    setUserPassword('');
  };
  const OKSuccessCleanup = () => {
    closeCleanup();
    setEdit(true);
  };
  const OKFailCleanup = () => {
    closeCleanup();
    showToast('error', 'password Incorrect, please contact Edward');
  };
  return (
    <>
      <IconButton
        onClick={() => {
          edit ? setEdit(false) : setOpenDialog(true);
        }}
      >
        {edit ? <LockOpenIcon className="text-3xl" /> : <LockOutlineIcon className="text-3xl" />}
      </IconButton>
      <Dialog opened={openDialog}>
        <DialogTitle>Edit Validation</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              className="mt-2"
              required
              name="Old password"
              aria-label="Preferred Name"
              label="Preferred Name"
              placeholder="Enter your Preferred Name"
              type="password"
              value={userPassword}
              onChange={e => setUserPassword(e.target.value)}
            ></TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCleanup}>Close</Button>
          <Button
            onClick={() => {
              if (encryptData(userPassword) === password) {
                OKSuccessCleanup();
              } else {
                OKFailCleanup();
              }
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
