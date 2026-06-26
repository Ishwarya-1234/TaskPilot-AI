export function parseRescuePlan(rescuePlan) {
  if (!rescuePlan) {
    throw new Error("Empty response from Deadline Guardian.");
  }

  if (typeof rescuePlan === "object") {
    return normalizeRescuePlan(rescuePlan);
  }

  let text = String(rescuePlan).trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    text = fenced[1].trim();
  }

  const parsed = JSON.parse(text);
  return normalizeRescuePlan(parsed);
}

function normalizeRescuePlan(data) {
  const emergencyActionPlan = (data.emergency_action_plan ?? []).map((item, index) => ({
    step: item.step ?? index + 1,
    action: item.action ?? "Take immediate action",
    durationHours: Number(item.duration_hours) || 0,
  }));

  const strategy = data.minimum_viable_strategy ?? {};
  const minimumViableStrategy = {
    summary: strategy.summary ?? "Focus on the smallest shippable outcome.",
    mustComplete: strategy.must_complete ?? strategy.mustComplete ?? [],
    scopeToCut: strategy.scope_to_cut ?? strategy.scopeToCut ?? [],
  };

  const timeAllocation = (data.time_allocation ?? []).map((item, index) => ({
    id: index + 1,
    block: item.block ?? `Block ${index + 1}`,
    hours: Number(item.hours) || 0,
    activities: item.activities ?? "",
  }));

  if (
    emergencyActionPlan.length === 0 &&
    timeAllocation.length === 0 &&
    !minimumViableStrategy.summary
  ) {
    throw new Error("AI returned an empty rescue plan.");
  }

  return { emergencyActionPlan, minimumViableStrategy, timeAllocation };
}
