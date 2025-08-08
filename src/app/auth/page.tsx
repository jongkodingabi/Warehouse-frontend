import React, { useState } from "react";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            // Handle error (e.g., show a notification)
        }
    }
    return (

    )
}