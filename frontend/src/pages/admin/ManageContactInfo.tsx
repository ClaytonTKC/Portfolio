import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { contentService } from '../../services/content.service';
import type { ContactInfo } from '../../services/content.service';
import { StatusModal } from '../../components/ui/StatusModal';

export const ManageContactInfo: React.FC = () => {
    // const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [info, setInfo] = useState<ContactInfo>({
        id: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        twitter: '',
        website: ''
    });

    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const data = await contentService.getContactInfo();
            setInfo(data);
        } catch (error) {
            console.error('Failed to fetch contact info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInfo((prev: ContactInfo) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await contentService.updateContactInfo(info);
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Success',
                message: 'Contact information updated successfully'
            });
        } catch (error) {
            console.error('Failed to update contact info:', error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to update contact information'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal((prev: any) => ({ ...prev, isOpen: false }))}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Contact Info</h1>
                    <p className="text-[var(--color-text-muted)]">Manage your contact details and social links</p>
                </div>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-muted)]">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={info.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--glass-border)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-muted)]">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={info.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--glass-border)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="border-t border-[var(--glass-border)] my-6"></div>
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">Social Profiles</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-muted)]">LinkedIn URL</label>
                            <input
                                type="url"
                                name="linkedin"
                                value={info.linkedin}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/..."
                                className="w-full px-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--glass-border)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--color-text-muted)]">GitHub URL</label>
                            <input
                                type="url"
                                name="github"
                                value={info.github}
                                onChange={handleChange}
                                placeholder="https://github.com/..."
                                className="w-full px-4 py-2 rounded-lg bg-[var(--color-background)] border border-[var(--glass-border)] text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
