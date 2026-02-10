import React, { useState } from 'react';
import { contentService } from '../../services/content.service';
import { Button } from '../ui/Button';

export const UploadProfilePicture: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setMessage(null);

        try {
            await contentService.uploadProfilePicture(file);
            setMessage({ type: 'success', text: 'Profile picture uploaded successfully!' });
            // Ideally, refresh the profile picture in the app context or trigger a reload
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload profile picture.' });
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Profile Picture</h3>

            <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--glass-border)] bg-[var(--color-surface)] flex items-center justify-center">
                    {preview ? (
                        <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl">👤</span>
                    )}
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[var(--glass-border)] border-dashed rounded-lg cursor-pointer bg-[var(--color-surface)] hover:bg-[var(--color-surface-light)] transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <p className="text-sm text-[var(--color-text-muted)]">
                                {file ? file.name : "Click to upload"}
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        isLoading={uploading}
                        className="w-full"
                    >
                        Upload Picture
                    </Button>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-sm w-full text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};
