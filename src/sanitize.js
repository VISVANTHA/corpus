export function sanitizeText(input) {
  const text = String(input || "");
  return text.replace(/[<>]/g, "").trim().slice(0, 240);
}

export function allowRole(role) {
  return role === "admin" || role === "member" || role === "viewer";
}
