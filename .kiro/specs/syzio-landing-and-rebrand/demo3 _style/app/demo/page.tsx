import { Suspense } from "react"
import { PersonalDashboard } from "@/components/personal-dashboard"

export default function DemoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PersonalDashboard />
    </Suspense>
  )
}
