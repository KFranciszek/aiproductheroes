"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, File, X, LinkIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface FileItem {
  id: string
  name: string
  size: number
  type: "file" | "link"
  url?: string
}

interface FileUploaderProps {
  files: FileItem[]
  onUpload: (file: File) => void
  onAddLink: (url: string, name: string) => void
  onRemove: (id: string) => void
}

export function FileUploader({ files, onUpload, onAddLink, onRemove }: FileUploaderProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkName, setLinkName] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
    }
  }

  const handleAddLink = () => {
    if (linkUrl && linkName) {
      onAddLink(linkUrl, linkName)
      setLinkUrl("")
      setLinkName("")
      setShowLinkInput(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" className="relative bg-transparent" asChild>
          <label>
            <Upload className="h-4 w-4 mr-2" />
            Prześlij plik
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
          </label>
        </Button>
        <Button variant="outline" onClick={() => setShowLinkInput(!showLinkInput)}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Dodaj link
        </Button>
      </div>

      {showLinkInput && (
        <Card className="p-4 space-y-3">
          <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="URL" />
          <Input value={linkName} onChange={(e) => setLinkName(e.target.value)} placeholder="Nazwa linku" />
          <div className="flex gap-2">
            <Button onClick={handleAddLink} size="sm">
              Dodaj
            </Button>
            <Button onClick={() => setShowLinkInput(false)} size="sm" variant="outline">
              Anuluj
            </Button>
          </div>
        </Card>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {file.type === "file" ? (
                  <File className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  {file.type === "file" && <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onRemove(file.id)}>
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
