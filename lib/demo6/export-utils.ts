// Export utilities for test data

export function exportToJSON(data: Record<string, any>[], filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `${filename}.json`, "application/json");
}

export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape values that contain commas or quotes
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",")
    ),
  ];

  const csvString = csvRows.join("\n");
  downloadFile(csvString, `${filename}.csv`, "text/csv");
}

export function exportToSQL(
  data: Record<string, any>[],
  tableName: string,
  filename: string
) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const sqlStatements = [
    `-- SQL Insert Statements for ${tableName}`,
    `-- Generated: ${new Date().toISOString()}`,
    "",
    ...data.map((row) => {
      const values = headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) return "NULL";
        if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
        if (typeof value === "boolean") return value ? "1" : "0";
        return value;
      });
      return `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES (${values.join(", ")});`;
    }),
  ];

  const sqlString = sqlStatements.join("\n");
  downloadFile(sqlString, `${filename}.sql`, "text/plain");
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
