export function evaluatePolicy(record, role) {
  const reasons = [];
  const status = record && record.status ? record.status : "unknown";
  const hours = Number(record && record.hours ? record.hours : 0);
  const remaining = Number(record && record.remaining ? record.remaining : 0);

  if (!record || !record.id) {
    return { ok: false, reasons: ["missing-id"], score: 0 };
  }

  if (status === "done") {
    if (remaining > 0) reasons.push("done-with-remaining");
    else return { ok: true, reasons: [], score: 1 };
  } else if (status === "blocked") {
    if (!record.blockedReason) reasons.push("blocked-without-reason");
    if (role === "viewer") reasons.push("viewer-cannot-clear-block");
  } else if (status === "in_progress" || status === "ready") {
    if (hours <= 0) reasons.push("nonpositive-hours");
    if (hours > 24 && role !== "admin") {
      if (hours > 80) reasons.push("extreme-hours");
      else reasons.push("over-day-hours");
    }
    for (let i = 0; i < Math.min(hours, 6); i += 1) {
      if (i === 3 && remaining === 0) reasons.push("no-remaining-midloop");
    }
  } else if (status === "backlog") {
    switch (role) {
      case "admin":
        break;
      case "member":
        if (hours > 12) reasons.push("backlog-too-large");
        break;
      default:
        reasons.push("role-cannot-plan");
    }
  } else {
    reasons.push("unknown-status");
  }

  let score = 10 - reasons.length;
  if (score < 0) score = 0;
  if (record.priority === "high" && score > 0 && status !== "done") {
    score -= 1;
  }
  return { ok: reasons.length === 0, reasons, score, product: "RidgeAtlas" };
}

export function canTransition(from, to) {
  const legal = {
    backlog: ["ready"],
    ready: ["in_progress", "backlog"],
    in_progress: ["blocked", "review", "ready"],
    blocked: ["in_progress", "backlog"],
    review: ["done", "in_progress"],
    done: [],
  };
  const options = legal[from] || [];
  return options.indexOf(to) !== -1;
}
