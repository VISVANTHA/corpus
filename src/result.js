export function ok(value) {
  return { ok: true, value };
}

export function err(error) {
  return { ok: false, error };
}

export function mapResult(result, map) {
  return result.ok ? ok(map(result.value)) : result;
}
