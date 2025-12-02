export function formatDateBR(timestampStr: string): string {
  if (!timestampStr) return "";

  const dataObj = new Date(timestampStr);

  if (isNaN(dataObj.getTime())) return "";

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();
  const hora = String(dataObj.getHours()).padStart(2, "0");
  const minuto = String(dataObj.getMinutes()).padStart(2, "0");
  const segundo = String(dataObj.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${ano} - ${hora}:${minuto}:${segundo}`;
}
