"use client";
import React from "react";
import { useForm } from "react-hook-form";

import { CardRegister } from "@/services/generatingProof";
import { UpdateCards } from "@/services/card-store";

import { ICardInfo } from "@/interface/card";

type FormData = {
    cardNumber: string;
    cvc: string;
    salt: string;
};

export default function CardRegisterContainer(){
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    const formatCardNumber = (value: string) =>
        value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

    const onSubmit = async (data: FormData) => {
        const formattedData = {
            ...data,
            cardNumber: data.cardNumber.replace(/\s/g, ""), // Remove spaces from card number
        };
        console.log("Formatted Data:", formattedData);
        const response = await CardRegister(
            formattedData.cardNumber,
            formattedData.cvc,
            formattedData.salt
        )
        const public_outputs = JSON.parse(response.public_output)
        const card: ICardInfo = {
            card_number: response.card_number,
            owner: "User's wallet address after connect",
            created: new Date(),
            public_output1: public_outputs[0],
            public_output2: public_outputs[1],
            public_output3: public_outputs[2]
        }
        UpdateCards(card)
    };

    return (
        <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-bold mb-4">Payment Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                {/* Card Number */}
                <div className="flex flex-col">
                    <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
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

                {/* Salt */}
                <div className="flex flex-col">
                    <label htmlFor="salt" className="text-sm font-medium text-gray-700">
                        Salt
                    </label>
                    <input
                        type="text"
                        id="salt"
                        placeholder="Enter salt value"
                        className={`mt-1 px-3 py-2 border ${
                            errors.salt ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        {...register("salt", {
                            required: "Salt is required",
                            validate: (value) => value.trim() !== "" || "Salt cannot be empty",
                        })}
                    />
                    {errors.salt && <p className="text-red-500 text-sm">{errors.salt.message}</p>}
                </div>

                {/* CVC */}
                <div className="flex flex-col">
                    <label htmlFor="cvc" className="text-sm font-medium text-gray-700">
                        CVC
                    </label>
                    <input
                        type="text"
                        id="cvc"
                        placeholder="123"
                        maxLength={3}
                        className={`mt-1 px-3 py-2 border ${
                            errors.cvc ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        {...register("cvc", {
                            required: "CVC is required",
                            validate: (value) => {
                                return /^\d{3}$/.test(value) || "CVC must be 3 digits";
                            },
                        })}
                        onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 3);
                        }}
                    />
                    {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </form>
        </section>
    );
};

