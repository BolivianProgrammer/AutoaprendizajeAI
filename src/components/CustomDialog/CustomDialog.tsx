import { SubjectManager } from "@/models";
import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs";

interface Props {
  children: React.ReactNode;
}

export const dialogOpenSubject$ = new SubjectManager<boolean>();
export const dialogCloseSubject$ = new SubjectManager<boolean>();

export const CustomDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  let openSubject$ = new Subscription();
  let closeSubject$ = new Subscription();

  useEffect(() => {
    openSubject$ = dialogOpenSubject$.getSubject.subscribe(() =>
      handleClickOpen()
    );
    closeSubject$ = dialogCloseSubject$.getSubject.subscribe(() =>
      handleClose()
    );
    return () => {
      openSubject$.unsubscribe();
      closeSubject$.unsubscribe();
    };
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExit = () => {
    dialogCloseSubject$.setSubject = false;
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => handleExit()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(102, 126, 234, 0.2)",
            backdropFilter: "blur(5px)",
          },
        }}
      >
        {children}
      </Dialog>
    </div>
  );
};

export default CustomDialog;
