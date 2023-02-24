export async function downloadJSON(sheet: object, fileName: string) {
  // send the json object to the client
  const blob = new Blob([JSON.stringify(sheet)], {
    type: "application/json",
  });
  fileName = fileName.substring(0, fileName.lastIndexOf(".") + 1);
  fileName = fileName + "json";

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", fileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}