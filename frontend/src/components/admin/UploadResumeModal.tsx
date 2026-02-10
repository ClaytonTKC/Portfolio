import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { contentService } from '../../services/content.service';

interface UploadResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UploadResumeModal: React.FC<UploadResumeModalProps> = ({ isOpen, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [lang, setLang] = useState<'en' | 'fr'>('en');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        setMessage('');

        try {
            await contentService.uploadResume(file, lang);
            setMessage('Resume uploaded successfully!');
            setFile(null);
            setTimeout(() => {
                onClose();
                setMessage('');
            }, 1500);
        } catch (error) {
            console.error('Failed to upload resume:', error);
            setMessage('Failed to upload resume.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--color-surface)] rounded-xl w-full max-w-md p-6 border border-[var(--glass-border)] shadow-xl">
                <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="lang"
                                    value="en"
                                    checked={lang === 'en'}
                                    onChange={() => setLang('en')}
                                    className="accent-[var(--color-primary)]"
                                />
                                English
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="lang"
                                    value="fr"
                                    checked={lang === 'fr'}
                                    onChange={() => setLang('fr')}
                                    className="accent-[var(--color-primary)]"
                                />
                                French
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Resume PDF</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="w-full text-sm text-[var(--color-text-muted)]
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[var(--color-primary)] file:text-white
                                hover:file:opacity-90 cursor-pointer"
                        />
                    </div>

                    {message && (
                        <p className={`text-sm ${message.includes('Success') ? 'text-green-500' : 'text-[var(--color-primary)]'}`}>
                            {message}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={!file || isLoading}
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
