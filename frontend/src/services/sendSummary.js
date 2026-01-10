export default async function sendSummaryToBackend(payload, backend_url) {
  try {
    // 1. Retrieve the token from storage
    const token = localStorage.getItem("auth_token");

    if (!token) {
      console.error("No auth token found. Cannot save summary.");
      return false;
    }

    const res = await fetch(`${backend_url}/api/interviews`, {
      method: "POST",
      // credentials: "include",  <-- REMOVE THIS (we don't need cookies)
      headers: {
        "Content-Type": "application/json",
        // 2. Add the Token Header
        "Authorization": `Bearer ${token}`,
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