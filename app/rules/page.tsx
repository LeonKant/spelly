import DefaultWrapper from "@/components/DefaultWrapper";

export default function RulesPage() {
  return (
    <DefaultWrapper centerChildren innerClassName="flex-1 w-full">
      <div className="animate-fade-slide-in flex-1 space-y-4">
        <h1>Rules</h1>
        <hr className="border-white" />
        <div className="italic">New modes coming soon!</div>
        <section className="space-y-4">
          <h3>Default Mode</h3>
          <ol className="list-inside list-decimal space-y-2">
            <li>Players take turns adding one letter to form a word.</li>
            <li>
              A player must add a valid letter that keeps the word forming.
            </li>
            <li>
              If a player cannot add a valid letter, they receive a point.
            </li>
            <li>
              The game progresses through every letter in the alphabet before
              ending.
            </li>
            <li>The player with the least points at the end wins!</li>
          </ol>
        </section>
      </div>
    </DefaultWrapper>
  );
}
