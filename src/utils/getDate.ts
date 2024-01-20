export function getDate(): string {
  let date = new Date();
  let hour = date.toLocaleTimeString("es-PE", {
    timeZone: "America/Lima",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let milliseconds = String(date.getMilliseconds())
    .slice(0, 2)
    .padStart(2, "0");

  let newDate = `${date.getFullYear()}-${month}-${date.getDate()} ${hour}-${milliseconds}`;
  return newDate;
}
