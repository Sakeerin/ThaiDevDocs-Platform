'use client'

import { DocSearchModal } from '@docsearch/react'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!
const algoliaSearchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? 'thaidevdocs'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlgoliaSearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !open) return null

  return createPortal(
    <DocSearchModal
      appId={algoliaAppId}
      apiKey={algoliaSearchKey}
      indexName={algoliaIndexName}
      onClose={() => onOpenChange(false)}
      placeholder="ค้นหาใน ThaiDevDocs..."
      initialScrollY={window.scrollY}
      // no-op: we don't use Ask AI mode
      onAskAiToggle={() => {}}
    />,
    document.body,
  )
}
