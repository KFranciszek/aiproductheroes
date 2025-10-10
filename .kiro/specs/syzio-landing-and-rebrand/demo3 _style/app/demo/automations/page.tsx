import { Suspense } from "react"
import { AutomationsView } from "@/components/automations-view"

export default function AutomationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AutomationsView />
    </Suspense>
  )
}
