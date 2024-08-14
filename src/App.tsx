import TldrawComponent from "./TldrawComponent";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#333",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        padding: "10px", // Added padding for better spacing
        backgroundColor: "#fff", // Background color for the heading
      }}>
        Create Timeline
      </div>
      
      <TldrawComponent />
    </div>
  );
}
