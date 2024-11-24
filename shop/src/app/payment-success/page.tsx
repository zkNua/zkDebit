"use client";

import {
  Container,
  Grid2 as Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Image from "next/image";

export default function PaymentSuccessPage() {
  return (
    <Container
      sx={{
        height: "100%",
        p: "0 !important",
      }}
    >
      <Grid container>
        <Grid size={12} mt={4}>
          <Paper
            sx={{
              backgroundColor: "white",
              px: 4,
              pt: 2,
            }}
          >
            <Stack flex={1} textAlign={"center"}>
              <CheckCircleOutlinedIcon
                sx={{ color: "#00BF61", fontSize: 36, margin: "0 auto" }}
              />
              <Typography variant="h5" color="textPrimary">
                Payment Completed
              </Typography>
              <Typography variant="subtitle1" color="textDisabled" mb={4}>
                Successfully paid $100 to Frog Shop.
              </Typography>

              <Typography variant="subtitle1" textAlign={"left"}>
                Payment methods
              </Typography>
              <Grid container textAlign={"left"} p={{ md: 5, sm: 3, xs: 2 }}>
                <Grid size={6}>
                  <Typography variant="subtitle2">Transaction ID</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" textAlign={"right"}>
                    1234435
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2">Date</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" textAlign={"right"}>
                    15 November 2024
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2">
                    Type of Transaction
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" textAlign={"right"}>
                    zkDebit
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2">Status</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="subtitle2" textAlign={"right"}>
                    Success
                  </Typography>
                </Grid>
                <Grid size={12} mt={2}>
                  <Paper
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: "none",
                      p: 0.5,
                      px: 1.5,
                      backgroundColor: "#00BF61",
                      color: "white",
                    }}
                  >
                    <Typography variant="subtitle2" textAlign={"right"}>
                      Total
                    </Typography>
                    <Typography variant="subtitle2" textAlign={"right"}>
                      $ 100
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={12} mt={2}>
                  <Image
                    src="/images/logo.png"
                    alt="zkDebit-logo"
                    width={148}
                    height={24}
                    style={{
                      width: "100%",
                      objectFit: "contain",
                      marginTop: 24,
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
