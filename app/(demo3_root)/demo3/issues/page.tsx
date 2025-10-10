import { Suspense } from "react"
import { IssuesList } from "@/components/demo3/issues-list"

export default function IssuesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IssuesList />
    </Suspense>
  )
}
