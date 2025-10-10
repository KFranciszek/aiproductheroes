import { Suspense } from "react"
import { SettingsView } from "@/components/settings-view"

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsView />
    </Suspense>
  )
}
