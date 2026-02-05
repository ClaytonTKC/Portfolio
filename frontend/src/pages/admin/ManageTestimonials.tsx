import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { contentService, type Testimonial } from '../../services/content.service';

export const ManageTestimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        isDestructive?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const data = await contentService.getAllTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await contentService.approveTestimonial(id);
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to approve testimonial:', error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await contentService.rejectTestimonial(id);
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to reject testimonial:', error);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Delete Testimonial',
            message: 'Are you sure you want to delete this testimonial? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await contentService.deleteTestimonial(id);
                    fetchTestimonials();
                } catch (error) {
                    console.error('Failed to delete testimonial:', error);
                }
            },
            isDestructive: true,
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Manage Testimonials</h1>

            <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} hover={false}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{testimonial.authorName || testimonial.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${testimonial.status === 'approved'
                                        ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
                                        : testimonial.status === 'rejected'
                                            ? 'bg-[var(--color-error)]/20 text-[var(--color-error)]'
                                            : 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]'
                                        }`}>
                                        {testimonial.status}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--color-text-muted)] mb-2">{testimonial.authorEmail}</p>
                                <p className="mb-2">{testimonial.content}</p>
                                {testimonial.rating && (
                                    <div className="text-yellow-400">
                                        {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {testimonial.status === 'pending' && (
                                    <>
                                        <Button variant="primary" className="text-sm px-3 py-1 bg-[var(--color-success)] hover:opacity-90 border-none" onClick={() => handleApprove(testimonial.id)}>
                                            Approve
                                        </Button>
                                        <Button variant="secondary" className="text-sm px-3 py-1 bg-[var(--color-error)] text-white hover:opacity-90 border-none" onClick={() => handleReject(testimonial.id)}>
                                            Reject
                                        </Button>
                                    </>
                                )}
                                <Button variant="secondary" className="text-sm px-3 py-1 hover:bg-[var(--color-error)] hover:text-white" onClick={() => handleDelete(testimonial.id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            {testimonials.length === 0 && (
                <p className="text-[var(--color-text-muted)] text-center">No testimonials found.</p>
            )}

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                isDestructive={confirmation.isDestructive}
            />
        </div>
    );
};
