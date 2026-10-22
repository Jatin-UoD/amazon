import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/homepilot/widgets";

export const Route = createFileRoute("/")({ component: Page });

function Page() {
  const [App, setApp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    void import("@/components/homepilot/app").then((m) => setApp(() => m.HomePilotApp));
  }, []);
  if (!App) {
    return (
      <main className="grid h-dvh place-items-center bg-stage px-6 text-center">
        <div>
          <div className="mx-auto w-fit">
            <Logo />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-stage-fg">HomePilot</h1>
          <p className="mt-1 text-stage-muted">One Home. One App. Total Control.</p>
        </div>
      </main>
    );
  }
  return <App />;
}
