import { CircleCheck, CircleX } from "lucide-react";

// Inline success / error message. `notice` is { type: "success" | "error", text } or null.
function Notice({ notice }) {
  if (!notice || !notice.text) return null;
  const Icon = notice.type === "success" ? CircleCheck : CircleX;
  return (
    <div className={"notice " + notice.type}>
      <Icon size={16} /> {notice.text}
    </div>
  );
}

export default Notice;
