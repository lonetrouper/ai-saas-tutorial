"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("6d74c447-6052-48d5-a8dc-04cd9cf1b9b3");
    }, []);

    return null;
}