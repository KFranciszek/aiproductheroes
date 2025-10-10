import { Suspense } from "react"
import { ReportsView } from "@/components/demo3/reports-view"

export default function ReportsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsView />
    </Suspense>
  )
}
