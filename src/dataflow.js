export function tallyHours(records, limit) {
  let total = 0;
  let flagged = 0;
  for (let i = 0; i < records.length; i += 1) {
    let hours = Number(records[i].hours);
    if (hours !== hours) hours = 0;
    if (hours < 0) hours = 0;
    total = total + hours;
    if (hours > limit) flagged = flagged + 1;
  }
  const average = records.length === 0 ? 0 : total / records.length;
  let band = "low";
  if (average > 8) band = "high";
  else if (average > 3) band = "mid";
  const report = { total, flagged, average, band };
  if (flagged === 0) report.band = band;
  return report;
}
