export function exportToMarkdown(data: any, filename: string): void {
  let markdown = `# ${filename}\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  
  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      markdown += `## Item ${i + 1}\n\n`;
      markdown += JSON.stringify(item, null, 2) + "\n\n";
    });
  } else {
    markdown += "```json\n";
    markdown += JSON.stringify(data, null, 2);
    markdown += "\n```\n";
  }
  
  downloadFile(markdown, `${filename}.md`, "text/markdown");
}

export function exportToJSON(data: any, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, "application/json");
}

export function exportToCSV(data: any[], filename: string): void {
  if (!data || data.length === 0) {
    downloadFile("", `${filename}.csv`, "text/csv");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(",")
    ),
  ];

  downloadFile(csvRows.join("\n"), `${filename}.csv`, "text/csv");
}

export function exportToSQL(data: any[], tableName: string, filename: string): void {
  if (!data || data.length === 0) {
    downloadFile("", `${filename}.sql`, "text/plain");
    return;
  }

  const headers = Object.keys(data[0]);
  const sqlStatements = data.map(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
      if (value === null || value === undefined) return "NULL";
      return value;
    });
    return `INSERT INTO ${tableName} (${headers.join(", ")}) VALUES (${values.join(", ")});`;
  });

  const sql = `-- Generated: ${new Date().toISOString()}\n\n${sqlStatements.join("\n")}`;
  downloadFile(sql, `${filename}.sql`, "text/plain");
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
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
