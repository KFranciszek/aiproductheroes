import { Suspense } from "react"
import { ActivityView } from "@/components/demo3/activity-view"

export default function ActivityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivityView />
    </Suspense>
  )
}
