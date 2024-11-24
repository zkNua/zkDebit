"use client";

import localFont from "next/font/local";
import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ReactQueryProvider from "../utils/ReactQueryProvider";
import { Box, Container, Grid2 as Grid, Stack } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Image from "next/image";
import { useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const steps = ["Order Summary", "Payment", "Complete"];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <Container maxWidth="sm" sx={{ height: "100%", p: 0 }}>
            <Stack display={"flex"} height={"100%"}>
              <Box
                mt={1}
                py={2}
                height={50}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                px={2}
                position={"relative"}
                sx={{ borderBottom: "1px solid #00000017" }}
              >
                <Image
                  src="/images/logo.png"
                  alt="zkDebit-logo"
                  width={148}
                  height={50}
                  style={{
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Box mt={1} py={2} height={50} px={2}>
                <Stepper activeStep={1}>
                  {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                      optional?: React.ReactNode;
                    } = {};
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step
                        key={label}
                        {...stepProps}
                        sx={{
                          "& .MuiStepLabel-iconContainer > .MuiSvgIcon-root.Mui-completed":
                            {
                              color: "#02D767",
                            },
                          "& .MuiStepLabel-iconContainer > .MuiSvgIcon-root.Mui-active":
                            {
                              color: "#02D767",
                            },
                          "& .MuiStepLabel-iconContainer > .MuiSvgIcon-root": {
                            color: "#c4c7c9",
                          },
                        }}
                      >
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>
              <Grid container sx={{ flex: 1 }}>
                <Grid size={12}>{children}</Grid>
              </Grid>
            </Stack>
          </Container>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
