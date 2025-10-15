import "./globals.css";
import React from "react";
import Navbar from "./components/Navbar";
import SessionWrapper from "./components/SessionWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <SessionWrapper>
          <Navbar />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
