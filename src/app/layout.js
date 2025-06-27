import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ohio State Pizzas Admin",
  description: "Admin portal",
  icons: {
    icon: "https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Image.png",
    shortcut: "https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Image.png",
    apple: "https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Image.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Directly use the image URL for all favicon needs */}
        <link 
          rel="icon" 
          href="https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Image.png" 
          type="image/png" 
        />
        
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}