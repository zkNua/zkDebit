import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Box } from "@mui/material";

type QrReaderProps = {
  onDetected: (pi3: string, chainId: string) => void;
};
const QrReader = (props: QrReaderProps) => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    // 🖨 Print the "result" to browser console.
    console.log(result);
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });
      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
          console.log({ err });
        });
    }
    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  useEffect(() => {
    const containPi3 = scannedResult?.indexOf("pi3");
    const containChainId = scannedResult?.indexOf("chain_id");

    if (
      scannedResult &&
      containPi3 &&
      containPi3 >= 0 &&
      containChainId &&
      containChainId >= 0
    ) {
      let str1 = scannedResult;
      const [pi3, chainId] = str1
        .replaceAll('"', "")
        .replaceAll("pi3: ", "")
        .replaceAll("\nchain_id: ", "")
        .split(",");

      props.onDetected(
        `${pi3.slice(0, 16)}...${pi3.slice(pi3.length - 16)}`,
        chainId
      );
      setScannedResult("");
    }
  }, [scannedResult]);

  return (
    <Box flex={1}>
      <video ref={videoEl} style={{ width: "100%", height: "100%" }}></video>
      <div ref={qrBoxEl} className="qr-box" />
    </Box>
  );
};

export default QrReader;
