import type { Metadata } from "next";

import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services — Lorum Ipsum",
  description:
    "All of the disciplines we work in — Blockchain, AI Automations, IoT, Cloud, App, Digital Marketing, SaaS, Web, and Game development — laid out as a single scrollable index.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
