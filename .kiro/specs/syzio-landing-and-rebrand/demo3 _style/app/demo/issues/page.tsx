import { Suspense } from "react"
import { IssuesList } from "@/components/issues-list"

export default function IssuesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IssuesList />
    </Suspense>
  )
}
