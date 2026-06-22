"use client"

import { useMemo, useState } from "react"
import type { JobCategory, JobListItem, JobSort } from "../types/job"

const pageSize = 3

export function useJobList(jobs: JobListItem[]) {
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState<JobCategory>("전체")
  const [showClosed, setShowClosed] = useState(false)
  const [sort, setSort] = useState<JobSort>("recommended")
  const [page, setPage] = useState(1)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])

  const filteredJobs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    const matchedJobs = jobs.filter((job) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        job.title.toLowerCase().includes(normalizedKeyword) ||
        job.companyName.toLowerCase().includes(normalizedKeyword) ||
        job.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword))
      const matchesCategory = category === "전체" || job.category === category
      const matchesStatus = showClosed || job.status !== "closed"

      return matchesKeyword && matchesCategory && matchesStatus
    })

    return [...matchedJobs].sort((left, right) => {
      if (sort === "deadline") {
        if (left.deadline === null) return 1
        if (right.deadline === null) return -1
        return left.deadline.localeCompare(right.deadline)
      }

      if (sort === "latest") {
        if (left.deadline === null) return -1
        if (right.deadline === null) return 1
        return right.deadline.localeCompare(left.deadline)
      }

      const statusOrder = { open: 0, rolling: 1, closed: 2 }
      return statusOrder[left.status] - statusOrder[right.status]
    })
  }, [category, jobs, keyword, showClosed, sort])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginatedJobs = filteredJobs.slice((safePage - 1) * pageSize, safePage * pageSize)

  function updateKeyword(value: string) {
    setKeyword(value)
    setPage(1)
  }

  function updateCategory(value: JobCategory) {
    setCategory(value)
    setPage(1)
  }

  function updateShowClosed(value: boolean) {
    setShowClosed(value)
    setPage(1)
  }

  function updateSort(value: JobSort) {
    setSort(value)
    setPage(1)
  }

  function toggleBookmark(jobId: string) {
    setBookmarkedIds((currentIds) =>
      currentIds.includes(jobId)
        ? currentIds.filter((currentId) => currentId !== jobId)
        : [...currentIds, jobId]
    )
  }

  return {
    keyword,
    updateKeyword,
    category,
    updateCategory,
    showClosed,
    updateShowClosed,
    sort,
    updateSort,
    page: safePage,
    setPage,
    totalPages,
    filteredCount: filteredJobs.length,
    paginatedJobs,
    bookmarkedIds,
    toggleBookmark,
  }
}
