function mapHttpError(code, detail) {
  if (code === 400) {
    return { status: 400, error: "bad_request", detail: detail || "invalid legacy payload", retry: false };
  }
  if (code === 401) {
    return { status: 401, error: "unauthorized", detail: detail || "missing legacy actor", retry: false };
  }
  if (code === 404) {
    return { status: 404, error: "not_found", detail: detail || "legacy record missing", retry: false };
  }
  if (code === 409) {
    return { status: 409, error: "conflict", detail: detail || "legacy state conflict", retry: true };
  }
  return { status: 500, error: "internal", detail: detail || "legacy failure", retry: true };
}

function formatHttpError(error) {
  return error.status + ":" + error.error + ":" + error.detail;
}

export { mapHttpError, formatHttpError };
