"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const CopilotKit = dynamic(
  () => import("@copilotkit/react-core").then((mod) => mod.CopilotKit),
  { ssr: false }
);

export default function CopilotWrapper({ children }: { children: ReactNode }) {
  return (
    <CopilotKit publicApiKey="ck_pub_951dd94b8c3f30b463f70810f294aa17">
      {children}
    </CopilotKit>
  );
}
