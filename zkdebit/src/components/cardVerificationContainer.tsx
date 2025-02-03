"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { CardVerification } from "@/services/generatingProof";
import { format_generated_proof } from "@/utils/proofFormat";
import VerifyProof from "@/services/verifyProof";

import { saveAs } from "file-saver"; 

type VerificationFormData = {
  cardNumber: string;
  pi1: string;
  pi2: string;
  pi3: string;
  transaction: string;
  nonce: string;
};

export default function CardVerificaitonContainer() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerificationFormData>();
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const onSubmit = async (data: VerificationFormData) => {
    const formattedData = {
      ...data,
      cardNumber: data.cardNumber.replace(/\s/g, ""), // Remove spaces from card number
    };
    const public_outputs = [
      formattedData.pi1,
      formattedData.pi2,
      formattedData.pi3,
    ];
    try {
      const card_response = await CardVerification(
        public_outputs,
        formattedData.cardNumber,
        formattedData.transaction,
        formattedData.nonce
      );
      const response  = await fetch("/api/verify-proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proofs: card_response,
          hashed_transaction: formattedData.transaction
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error: `);
      }
  
      console.log(response)
      // // Save proof as a JSON file
      // const jsonData = {
      //   transactionHash: formattedData.transaction,
      //   nonce: formattedData.nonce,
      //   cardNumber: formattedData.cardNumber,
      //   public_outputs,
      //   proof,
      // };
      // const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      //   type: "application/json",
      // });
      // saveAs(blob, "verification-proof.json");
  
      setVerificationStatus("Verification Successful");
    } catch (error) {
      console.error("Error in Proof Verification:", error);
      setVerificationStatus("Verification Failed: An error occurred.");
    }
  };

  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Verification Form</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {/* Card Number */}
        <div className="flex flex-col">
          <label
            htmlFor="cardNumber"
            className="text-sm font-medium text-gray-700"
          >
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            placeholder="1234 5678 9123 4567"
            className={`mt-1 px-3 py-2 border ${
              errors.cardNumber ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            {...register("cardNumber", {
              required: "Card number is required",
              validate: (value) => {
                const cleaned = value.replace(/\D/g, "");
                return cleaned.length === 16 || "Card number must be 16 digits";
              },
            })}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setValue("cardNumber", formatted, { shouldValidate: true });
            }}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>
          )}
        </div>

        {/* Public Outputs */}
        {["pi1", "pi2", "pi3"].map((field, index) => (
          <div className="flex flex-col" key={index}>
            <label
              htmlFor={field}
              className="text-sm font-medium text-gray-700"
            >
              Public Output {index + 1} ({field})
            </label>
            <input
              type="text"
              id={field}
              placeholder={`Enter ${field}`}
              className={`mt-1 px-3 py-2 border ${
                errors[field as keyof VerificationFormData]
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              {...register(field as keyof VerificationFormData, {
                required: `Public Output ${index + 1} is required`,
              })}
            />
            {errors[field as keyof VerificationFormData] && (
              <p className="text-red-500 text-sm">
                {errors[field as keyof VerificationFormData]?.message}
              </p>
            )}
          </div>
        ))}

        {/* Transaction */}
        <div className="flex flex-col">
          <label
            htmlFor="transaction"
            className="text-sm font-medium text-gray-700"
          >
            Transaction (Hashed)
          </label>
          <input
            type="text"
            id="transaction"
            placeholder="Enter transaction hash"
            className={`mt-1 px-3 py-2 border ${
              errors.transaction ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            {...register("transaction", {
              required: "Transaction hash is required",
            })}
          />
          {errors.transaction && (
            <p className="text-red-500 text-sm">{errors.transaction.message}</p>
          )}
        </div>

        {/* Nonce */}
        <div className="flex flex-col">
          <label htmlFor="nonce" className="text-sm font-medium text-gray-700">
            Nonce (Hashed)
          </label>
          <input
            type="text"
            id="nonce"
            placeholder="Enter nonce"
            className={`mt-1 px-3 py-2 border ${
              errors.nonce ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            {...register("nonce", { required: "Nonce is required" })}
          />
          {errors.nonce && (
            <p className="text-red-500 text-sm">{errors.nonce.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Verify
        </button>
      </form>

      {/* Verification Status */}
      {verificationStatus && (
        <div
          className={`mt-4 p-4 rounded-md ${
            verificationStatus.includes("Successful")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {verificationStatus}
        </div>
      )}
    </section>
  );
}
