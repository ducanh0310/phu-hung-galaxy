import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Loader2, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

// Helper to get JWT token
const getToken = () => localStorage.getItem('jwt');

interface ImageUploaderProps {
  initialImageUrl?: string | null;
  onUploadSuccess: (url: string) => void;
  onUploadStateChange?: (isLoading: boolean) => void;
  className?: string;
}

type UploadStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ImageUploader({
  initialImageUrl,
  onUploadSuccess,
  onUploadStateChange,
  className,
}: ImageUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(initialImageUrl || null);
  }, [initialImageUrl]);

  useEffect(() => {
    onUploadStateChange?.(status === 'loading');
  }, [status, onUploadStateChange]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('loading');
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token not found.');

      const response = await fetch('/api/v1/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setStatus('success');
      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
      setTimeout(() => setStatus('idle'), 2000); // Reset status after 2s
    } catch (err) {
      setStatus('error');
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      // Don't clear preview on error, so user can see what they tried to upload
    }
  };

  const triggerFileSelect = () => {
    if (status === 'loading') return;
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setStatus('idle');
    setError(null);
    onUploadSuccess(''); // Notify parent that image is removed
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  return (
    <div className={cn('col-span-3', className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/gif"
        className="hidden"
      />
      <div
        onClick={triggerFileSelect}
        className={cn(
          'relative w-full aspect-video rounded-lg border-2 border-dashed border-slate-300 flex flex-col justify-center items-center text-slate-500 cursor-pointer hover:border-green-500 hover:text-green-600 transition-colors',
          {
            'border-green-500': status === 'loading',
            'border-red-500': status === 'error',
          },
        )}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-md" />
            {status !== 'loading' && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-70 hover:opacity-100"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <>
            <UploadCloud className="h-10 w-10" />
            <p className="mt-2 text-sm">Click to upload image</p>
          </>
        )}

        {status === 'loading' && (
          <div className="absolute inset-0 bg-white/80 flex justify-center items-center rounded-md">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          </div>
        )}
      </div>
      {status === 'success' && (
        <div className="mt-2 flex items-center text-sm text-green-600">
          <CheckCircle className="h-4 w-4 mr-2" />
          Upload successful!
        </div>
      )}
      {status === 'error' && error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
}