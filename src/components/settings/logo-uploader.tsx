'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Camera, 
  X, 
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

interface LogoUploaderProps {
  /** Current logo URL (can be Base64 data URL or file path) */
  currentLogoUrl?: string | null;
  /** Business name for placeholder initials */
  businessName: string;
  /** Primary color for placeholder background */
  primaryColor?: string;
  /** Callback when logo changes */
  onLogoChange?: (logoUrl: string | null) => void;
  /** Callback when logo is saved/persisted */
  onLogoSave?: (logoUrl: string) => Promise<void>;
  /** Tenant ID for API calls */
  tenantId?: string;
  /** Industry type for settings model */
  industry?: 'bakery' | 'clinic' | 'beauty' | 'lawfirm' | 'nurse' | 'retail' | 'general';
  /** Storage method: 'base64' or 'file' */
  storageMethod?: 'base64' | 'file';
  /** Size of the logo preview */
  size?: 'sm' | 'md' | 'lg';
  /** Show light/dark preview toggle */
  showBackgroundToggle?: boolean;
  /** Allow crop functionality (placeholder for future) */
  allowCrop?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export function LogoUploader({
  currentLogoUrl,
  businessName,
  primaryColor = '#6C3FCE',
  onLogoChange,
  onLogoSave,
  tenantId,
  industry = 'general',
  storageMethod = 'base64',
  size = 'md',
  showBackgroundToggle = true,
  allowCrop = false,
  disabled = false,
  className = ''
}: LogoUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(currentLogoUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState<'light' | 'dark'>('dark');
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  });
  const [hasChanges, setHasChanges] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: { container: 'w-20 h-20', icon: 'w-6 h-6', text: 'text-lg' },
    md: { container: 'w-28 h-28', icon: 'w-8 h-8', text: 'text-xl' },
    lg: { container: 'w-36 h-36', icon: 'w-10 h-10', text: 'text-2xl' }
  };

  const validateFile = useCallback((file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please use PNG, JPG, JPEG, SVG, or WEBP.';
    }
    if (file.size > 2 * 1024 * 1024) {
      return 'File size must be less than 2MB.';
    }
    return null;
  }, []);

  const convertToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const uploadToServer = useCallback(async (file: File): Promise<string> => {
    if (!tenantId) {
      // If no tenantId, just use Base64 locally
      return convertToBase64(file);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', tenantId);
    formData.append('industry', industry);
    formData.append('storageMethod', storageMethod);

    const response = await fetch('/api/upload/logo', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Upload failed');
    }

    const data = await response.json();
    return data.logoUrl;
  }, [tenantId, industry, storageMethod, convertToBase64]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (disabled) return;

    const validationError = validateFile(file);
    if (validationError) {
      setUploadState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setUploadState({ isUploading: true, progress: 0, error: null, success: false });

    try {
      // Create preview immediately
      const base64Preview = await convertToBase64(file);
      setPreviewUrl(base64Preview);
      setUploadState(prev => ({ ...prev, progress: 50 }));

      // Simulate progress for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadState(prev => ({ ...prev, progress: 75 }));

      // Upload to server if tenantId provided
      let finalUrl = base64Preview;
      if (tenantId) {
        finalUrl = await uploadToServer(file);
      }

      setUploadState(prev => ({ ...prev, progress: 100 }));
      setPreviewUrl(finalUrl);
      setHasChanges(finalUrl !== originalUrl);
      onLogoChange?.(finalUrl);

      // Auto-save if onLogoSave provided
      if (onLogoSave) {
        await onLogoSave(finalUrl);
      }

      setTimeout(() => {
        setUploadState({ isUploading: false, progress: 0, error: null, success: true });
        setOriginalUrl(finalUrl);
        setHasChanges(false);
      }, 500);

    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Failed to upload logo',
        success: false
      });
      // Revert preview on error
      setPreviewUrl(originalUrl);
    }
  }, [disabled, validateFile, convertToBase64, uploadToServer, tenantId, onLogoChange, onLogoSave, originalUrl]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleRemove = useCallback(async () => {
    if (disabled) return;

    setUploadState({ isUploading: true, progress: 50, error: null, success: false });

    try {
      // If tenantId provided, delete from server
      if (tenantId && previewUrl) {
        const deleteUrl = `/api/upload/logo?tenantId=${tenantId}&industry=${industry}&logoUrl=${encodeURIComponent(previewUrl)}`;
        const response = await fetch(deleteUrl, { method: 'DELETE' });
        
        if (!response.ok) {
          throw new Error('Failed to remove logo');
        }
      }

      setPreviewUrl(null);
      setHasChanges(true);
      setUploadState({ isUploading: false, progress: 0, error: null, success: true });
      onLogoChange?.(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error removing logo:', error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Failed to remove logo',
        success: false
      });
    }
  }, [disabled, tenantId, industry, previewUrl, onLogoChange]);

  const handleReset = useCallback(() => {
    setPreviewUrl(originalUrl);
    setHasChanges(false);
    setUploadState({ isUploading: false, progress: 0, error: null, success: false });
    onLogoChange?.(originalUrl);
  }, [originalUrl, onLogoChange]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Logo Preview Container */}
        <div className="flex flex-col items-center gap-3">
          {/* Background Toggle */}
          {showBackgroundToggle && previewUrl && (
            <div className="flex items-center gap-2 mb-2">
              <Button
                type="button"
                variant={backgroundMode === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBackgroundMode('dark')}
                className="h-7 px-2"
              >
                <Moon className="w-3 h-3 mr-1" />
                Dark
              </Button>
              <Button
                type="button"
                variant={backgroundMode === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setBackgroundMode('light')}
                className="h-7 px-2"
              >
                <Sun className="w-3 h-3 mr-1" />
                Light
              </Button>
            </div>
          )}

          {/* Logo Preview */}
          <div 
            className={`relative ${sizes.container} rounded-xl overflow-hidden border-2 transition-all ${
              dragOver 
                ? 'border-primary bg-primary/10 scale-105' 
                : uploadState.error
                  ? 'border-red-500'
                  : uploadState.success
                    ? 'border-green-500'
                    : 'border-border'
            } ${
              backgroundMode === 'light' ? 'bg-white' : 'bg-gray-900'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt={businessName}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                <span className={sizes.text}>{getInitials(businessName)}</span>
              </div>
            )}

            {/* Upload overlay */}
            <div 
              className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all ${
                disabled ? 'opacity-0' : 'bg-black/50 opacity-0 hover:opacity-100'
              }`}
              onClick={() => !disabled && !uploadState.isUploading && fileInputRef.current?.click()}
            >
              {uploadState.isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className={`${sizes.icon} text-white animate-spin`} />
                  {uploadState.progress > 0 && (
                    <span className="text-white text-xs mt-1">{uploadState.progress}%</span>
                  )}
                </div>
              ) : (
                <Camera className={`${sizes.icon} text-white`} />
              )}
            </div>

            {/* Success indicator */}
            {uploadState.success && !uploadState.isUploading && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Error indicator */}
            {uploadState.error && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">Business Logo</p>
            <p className="text-xs text-muted-foreground">
              This logo will appear on invoices, receipts, and customer portal.
            </p>
          </div>

          {/* Progress bar during upload */}
          {uploadState.isUploading && uploadState.progress > 0 && (
            <div className="space-y-1">
              <Progress value={uploadState.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </div>
          )}

          {/* Error message */}
          {uploadState.error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
              <AlertCircle className="w-4 h-4" />
              {uploadState.error}
            </div>
          )}

          {/* Success message */}
          {uploadState.success && !uploadState.isUploading && !uploadState.error && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
              <CheckCircle2 className="w-4 h-4" />
              Logo updated successfully!
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/svg+xml,image/webp"
              onChange={handleInputChange}
              className="hidden"
              disabled={disabled || uploadState.isUploading}
            />
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploadState.isUploading}
              className="gap-2"
            >
              {uploadState.isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </>
              )}
            </Button>
            
            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={disabled || uploadState.isUploading}
                className="text-red-500 hover:text-red-600 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </Button>
            )}

            {hasChanges && originalUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={disabled || uploadState.isUploading}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>

          {/* File format info */}
          <p className="text-xs text-muted-foreground">
            Formats: PNG, JPG, JPEG, SVG, WEBP. Max size: 2MB. Recommended: 200x200px.
          </p>

          {/* Drag hint */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="w-3 h-3" />
            <span>Drag & drop an image or click to browse</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LOGO PREVIEW COMPONENT (for display)
// ============================================
interface LogoPreviewProps {
  logoUrl?: string | null;
  businessName: string;
  primaryColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function LogoPreview({
  logoUrl,
  businessName,
  primaryColor = '#6C3FCE',
  size = 'md',
  className = '',
  rounded = 'lg'
}: LogoPreviewProps) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-2xl'
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center font-bold text-white ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`}
      style={{ backgroundColor: logoUrl ? 'transparent' : primaryColor }}
    >
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={businessName}
          className="w-full h-full object-contain"
        />
      ) : (
        <span>{getInitials(businessName)}</span>
      )}
    </div>
  );
}

export default LogoUploader;
