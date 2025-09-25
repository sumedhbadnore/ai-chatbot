import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
title: "Sumedh | AI Chatbot",
description: "Ask questions about Sumedh—skills, projects, resume, and more.",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<div className="container">{children}</div>
</body>
</html>
);
}