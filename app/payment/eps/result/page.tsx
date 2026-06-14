import { Suspense } from "react";
import { Card } from "@/components/ui";
import { EpsPaymentResultClient } from "./result-client";

export default function EpsPaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-12">
          <Card className="w-full p-6 text-center">
            <h1 className="text-3xl font-black">Loading payment result...</h1>
          </Card>
        </main>
      }
    >
      <EpsPaymentResultClient />
    </Suspense>
  );
}
