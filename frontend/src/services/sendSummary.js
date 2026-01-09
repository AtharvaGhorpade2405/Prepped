export default  async function sendSummaryToBackend(payload,backend_url) {
    try {
      const res = await fetch(backend_url, {
        method: "POST",
        credentials: "include",   
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend rejected summary:", data);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Failed to send summary:", err);
      return false;
    }
  }
