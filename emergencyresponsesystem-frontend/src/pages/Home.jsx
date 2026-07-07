function Home() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1>Welcome to Smart Hospital Emergency Response System</h1>
      <p style={{ fontSize: "18px", color: "#555", maxWidth: "700px", margin: "20px auto" }}>
        Find the nearest and most suitable hospital in seconds. We consider ICU bed availability,
        blood bank status, doctor availability, and real-time distance to get you the fastest,
        best-matched emergency care.
      </p>
    </div>
  );
}

export default Home;