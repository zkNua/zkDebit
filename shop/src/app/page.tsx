"use client";

import {
  Box,
  Divider,
  Grid2 as Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OrderSummaryPage() {
  const router = useRouter();

  const onClickPaymentMethod = (path: string) => {
    router.push(path);
  };

  const PAYMENT_METHODS = [
    { name: "Visa", icon: "/images/visa.png", path: "#" },
    { name: "Mastercard", icon: "/images/mastercard.png", path: "#" },
    { name: "Alipay", icon: "/images/alipay.png", path: "#" },
    { name: "ZkDebit", icon: "/images/zkdebit.png", path: "/pay-with-zkdebit" },
  ];

  return (
    <Grid container height={"100%"}>
      <Grid container size={12} spacing={2} p={{ md: 6, sm: 4, xs: 2 }}>
        <Grid size={12} mt={4}>
          <Paper
            sx={{
              backgroundColor: "white",
              px: 4,
              py: 2,
            }}
          >
            <Stack flex={1}>
              <Typography variant="caption" color="textSecondary">
                Pay frog shop
              </Typography>
              <Typography variant="h5">$100.00</Typography>
              <Box display={"flex"} mt={2}>
                <Image
                  src={"/images/shirt.png"}
                  alt="shirt"
                  width={48}
                  height={48}
                  objectFit="contain"
                />
                <Stack ml={2}>
                  <Typography variant="subtitle1">Shirt</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Qty 1
                  </Typography>
                </Stack>
                <Typography ml={"auto"} variant="body2">
                  $ 20.00
                </Typography>
              </Box>
              <Box display={"flex"} mt={2}>
                <Image
                  src={"/images/book.png"}
                  alt="book"
                  width={48}
                  height={48}
                  objectFit="contain"
                />
                <Stack ml={2}>
                  <Typography variant="subtitle1">Book</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Qty 1
                  </Typography>
                </Stack>
                <Typography ml={"auto"} variant="body2">
                  $ 80.00
                </Typography>
              </Box>
              <Divider sx={{ my: 4 }} />
              <Box display={"flex"} mt={1}>
                <Box width={"48px"} />
                <Typography ml={2} variant="body2">
                  Total Due
                </Typography>
                <Typography ml={"auto"} variant="body2">
                  $ 100.00
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={12} mt={2}>
          <Box
            sx={{
              px: 4,
              py: 2,
            }}
          >
            <Typography
              variant="h5"
              color="textSecondary"
              textAlign={"center"}
              mb={2}
            >
              Choose your payment method
            </Typography>
            <Stack flex={1} spacing={2}>
              {PAYMENT_METHODS.map((m, index) => (
                <Paper
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "none",
                    cursor: "pointer",
                    border: "1px solid #34343415",
                    p: 0.5,
                  }}
                  onClick={() => onClickPaymentMethod(m.path)}
                >
                  <Image
                    src={m.icon}
                    alt={m.name}
                    width={42}
                    height={12}
                    style={{ objectFit: "contain" }}
                  />
                  <Typography variant="h6" ml={"12px"}>
                    {m.name}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
