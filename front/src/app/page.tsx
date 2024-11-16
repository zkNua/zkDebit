"use client";

import { Grid2 as Grid, Typography } from "@mui/material";
import LoginForm from "@/components/forms/Login.form";

export default function LoginPage() {
  return (
    <Grid container height={"100%"}>
      <Grid
        container
        size={12}
        spacing={2}
        alignSelf={"center"}
        p={{ md: 12, sm: 4, xs: 0 }}
      >
        <Grid size={12} mb={4}>
          <Typography variant="h6" color="textPrimary" textAlign={"center"}>
            Welcome to zkDebit
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign={"center"}
          >
            You can setup your account with us here.
          </Typography>
        </Grid>
        <LoginForm />
      </Grid>
    </Grid>
  );
}
