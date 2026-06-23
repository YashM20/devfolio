import { Suspense } from "react"

import { getGitHubContributions } from "@/features/profile/data/github-contributions"

import { GitHubContributionFallback, GitHubContributionGraph } from "./graph"

export function GitHubContributions() {
  const contributions = getGitHubContributions()

  return (
    <div className="border-x border-edge">
      <h3 className="sr-only">GitHub Contributions</h3>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>

      <div className="h-px" />
    </div>
  )
}
