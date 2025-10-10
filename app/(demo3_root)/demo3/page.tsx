import { Suspense } from "react"
import { PersonalDashboard } from "@/components/demo3/personal-dashboard"

export default function Demo3Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonalDashboard />
    </Suspense>
  )
}
