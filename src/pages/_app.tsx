import Chatbot from "@/pages/chatbox";  // Import the Chatbot component
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ }: AppProps) {
  return (
    <>
      {/* <h1>Welcome to the Chatbot Application</h1> */}
      <Chatbot /> 
    </>
  );
}
