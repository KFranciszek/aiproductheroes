import { Suspense } from "react"
import { SprintsView } from "@/components/sprints-view"

export default function SprintsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SprintsView />
    </Suspense>
  )
}
