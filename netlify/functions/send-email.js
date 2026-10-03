exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Station Cleaning <onboarding@resend.dev>",
        to: [data.myEmail, data.coordinatorEmail],
        cc: data.ccEmail ? [data.ccEmail] : [],
        subject: `Station Cleaning Report - ${data.station || ""}`,
        html: `
          <h2>Station Cleaning Report</h2>
          <p><b>Employee:</b> ${data.employeeName || ""}</p>
          <p><b>EMP No:</b> ${data.empNo || ""}</p>
          <p><b>Station:</b> ${data.station || ""}</p>
          <p>The cleaning checklist has been submitted successfully.</p>
        `,
      }),
    });

    const result = await response.json();

    return {
      statusCode: response.ok ? 200 : response.status,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
