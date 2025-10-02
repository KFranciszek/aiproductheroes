import React, { useState, useRef } from 'react';
import { Attachment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploaderProps {
  issueId: string;
  onUpload: (files: File[]) => void;
  onAddLink: (url: string, name: string) => void;
  existingAttachments?: Attachment[];
  onDeleteAttachment?: (attachmentId: string) => void;
}

export function FileUploader({
  issueId,
  onUpload,
  onAddLink,
  existingAttachments = [],
  onDeleteAttachment
}: FileUploaderProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkName, setLinkName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Walidacja rozmiaru (max 10MB na plik)
    const maxSize = 10 * 1024 * 1024;
    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(validFiles);
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddLink = () => {
    if (linkUrl.trim() && linkName.trim()) {
      // Podstawowa walidacja URL
      try {
        new URL(linkUrl);
        onAddLink(linkUrl.trim(), linkName.trim());
        setLinkUrl('');
        setLinkName('');
      } catch {
        alert('Please enter a valid URL');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Istniejące załączniki */}
      {existingAttachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Attachments</h4>
          {existingAttachments.map(attachment => (
            <Card key={attachment.id} className="p-2">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {attachment.type === 'file' ? (
                      <span className="text-sm">📄 {attachment.name}</span>
                    ) : (
                      <span className="text-sm">🔗 {attachment.name}</span>
                    )}
                    {attachment.size && (
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </span>
                    )}
                  </div>
                  {onDeleteAttachment && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteAttachment(attachment.id)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload plików */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          Max 10MB per file. Supported: images, PDF, documents
        </p>
      </div>

      {/* Dodawanie linków */}
      <div className="flex gap-2">
        <Input
          placeholder="Link URL (e.g. https://example.com)"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          type="url"
        />
        <Input
          placeholder="Link name"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
        />
        <Button onClick={handleAddLink} disabled={!linkUrl.trim() || !linkName.trim()}>
          Add Link
        </Button>
      </div>
    </div>
  );
}
