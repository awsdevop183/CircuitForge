import Link from "next/link";
import { LogicPlayground } from "./LogicPlayground";

/** The playground as a full lab page, with pointers to what to try. */
export function LogicPlaygroundLab() {
  return (
    <div className="space-y-6">
      <div className="panel-raised overflow-hidden rounded-2xl">
        <LogicPlayground />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { title: "Try this", text: "Load “(A AND B) OR C”. Which input combinations turn Y on? Check your answer in the truth table." },
          { title: "Then this", text: "Load “XOR from 4 NANDs” and prove it matches a single XOR gate on every row." },
          { title: "Your turn", text: "Clear the board and build a circuit where Y is 1 only when A is 1 and B is 0." },
        ].map((tip) => (
          <div key={tip.title} className="panel rounded-xl p-4">
            <p className="eyebrow text-logic">{tip.title}</p>
            <p className="mt-1 text-sm text-ink-muted">{tip.text}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-ink-muted">
        Ready for goals? Try the{" "}
        <Link href="/lab/build-the-logic" className="text-logic underline underline-offset-2 hover:text-logic-soft">
          Build the Logic challenge
        </Link>{" "}
        or the{" "}
        <Link href="/quiz/digital-electronics" className="text-logic underline underline-offset-2 hover:text-logic-soft">
          Digital Electronics quiz
        </Link>
        .
      </p>
    </div>
  );
}
