import { Suspense } from "react"
import { TeamsView } from "@/components/teams-view"

export default function TeamsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamsView />
    </Suspense>
  )
}
