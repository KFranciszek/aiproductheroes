import { Suspense } from "react"
import { SettingsView } from "@/components/demo3/settings-view"

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsView />
    </Suspense>
  )
}
