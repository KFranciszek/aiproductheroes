import { Suspense } from "react"
import { TeamsView } from "@/components/demo3/teams-view"

export default function TeamsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamsView />
    </Suspense>
  )
}
