import { Suspense } from "react"
import { SprintsView } from "@/components/demo3/sprints-view"

export default function SprintsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SprintsView />
    </Suspense>
  )
}
