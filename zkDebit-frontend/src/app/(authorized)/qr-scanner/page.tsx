"use client";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { useRouter } from "next/navigation";
import QrReader from "@/components/QrReader";
import { useState } from "react";

export default function QrScannerPage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setMsg("");
  };

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flex: 1,
          p: "0 !important",
        }}
      >
        <Grid
          container
          display={"flex"}
          flexDirection={"column"}
          sx={{ flex: 1 }}
        >
          <Grid size={12} px={2}>
            <Button
              onClick={() => {
                router.back();
              }}
              sx={{ minWidth: "initial", width: 36 }}
            >
              <ArrowBackOutlinedIcon />
            </Button>
          </Grid>
          <Grid
            size={12}
            px={2}
            sx={{
              display: "flex",
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                backgroundColor: "#222222",
              }}
            >
              <QrReader
                onDetected={(pi3, chainId) => {
                  setOpen(true);
                  setMsg(`PI3: ${pi3}`);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={msg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
