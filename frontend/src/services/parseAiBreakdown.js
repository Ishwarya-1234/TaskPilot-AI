export function parseAiBreakdown(aiBreakdown) {
  if (!aiBreakdown) {
    throw new Error("Empty response from AI planner.");
  }

  if (typeof aiBreakdown === "object") {
    return normalizePlan(aiBreakdown);
  }

  let text = String(aiBreakdown).trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    text = fenced[1].trim();
  }

  const parsed = JSON.parse(text);
  return normalizePlan(parsed);
}

function normalizePlan(data) {
  const subtasks = (data.subtasks ?? []).map((item, index) => ({
    id: index + 1,
    title: item.title ?? "Untitled subtask",
    hours: Number(item.hours) || 0,
    priority: normalizePriority(item.priority),
  }));

  if (subtasks.length === 0) {
    throw new Error("AI returned a plan with no subtasks.");
  }

  return { subtasks };
}

function normalizePriority(priority) {
  const value = String(priority ?? "Medium").toLowerCase();
  if (value.includes("high")) return "High";
  if (value.includes("low")) return "Low";
  return "Medium";
}
