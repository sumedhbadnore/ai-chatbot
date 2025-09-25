// bot-app/src/app/embed/page.tsx
export const runtime = "edge";

export default function Embed() {
  return (
    <div style={{
      height: "100vh",
      margin: 0,
      padding: 12,
      background: "transparent",
    }}>
      {/* your ChatWidget */}
      {/* If your widget depends on global styles, import them here */}
      {/* e.g., import "../../globals.css"; */}
      {/* Or inline minimal styles in the widget */}
      {/* <ChatWidget /> */}
    </div>
  );
}
