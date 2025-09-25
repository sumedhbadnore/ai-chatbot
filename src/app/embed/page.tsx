// app/embed/page.tsx (bot app)
import "@/app/globals.css"; // ✅ pull in the widget styles
import ChatWidget from "../../components/ChatWidget";

export const runtime = "edge";

export default function Embed() {
  return (
    <div
      style={{
        padding: 12,
        background: "transparent",
        minHeight: "100vh", // avoid cramped layout
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 380, maxWidth: "100%" }}>
        <ChatWidget />
      </div>
    </div>
  );
}
