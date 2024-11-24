"use client";

import { Box, Container, Grid2 as Grid, Typography } from "@mui/material";
import Image from "next/image";

export default function PayWithZkDebitPage() {
  return (
    <Container
      sx={{
        height: "100%",
        p: "0 !important",
      }}
    >
      <Grid container>
        <Grid size={12}>
          <Box display={"flex"} justifyContent={"center"} mt={10}>
            <Image
              src="/images/zkdebit-big.png"
              alt="zkDebit-logo"
              width={148}
              height={148}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign={"center"}
          >
            Scan with your zkDebit application
          </Typography>
        </Grid>
        <Grid size={12} mt={4}>
          <Box display={"flex"} justifyContent={"center"}>
            <Image
              src="/images/qrcode.png"
              alt="qrcode"
              width={300}
              height={300}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            variant="subtitle2"
            color="textDisabled"
            textAlign={"center"}
            mt={2}
          >
            By scanning, you automatically submit your data to generate proof.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
