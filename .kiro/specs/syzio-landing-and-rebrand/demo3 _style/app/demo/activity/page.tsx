import { Suspense } from "react"
import { ActivityView } from "@/components/activity-view"

export default function ActivityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivityView />
    </Suspense>
  )
}
