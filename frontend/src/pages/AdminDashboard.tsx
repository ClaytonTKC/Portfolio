import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { AddProjectModal } from '../components/admin/AddProjectModal';
import { AddSkillModal } from '../components/admin/AddSkillModal';
import { contentService, type Testimonial, type Message } from '../services/content.service';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState<'project' | 'skill' | null>(null);
    const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
    const [recentMessages, setRecentMessages] = useState<Message[]>([]);

    // Confirmation Modal State
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
        const fetchData = async () => {
            try {
                const [testimonials, messages] = await Promise.all([
                    contentService.getPendingTestimonials(),
                    contentService.getRecentMessages()
                ]);
                setPendingTestimonials(testimonials);
                setRecentMessages(messages);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    const handleApprove = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Approve Testimonial',
            message: 'Are you sure you want to approve this testimonial? It will become visible on the public site.',
            onConfirm: async () => {
                try {
                    await contentService.approveTestimonial(id);
                    setPendingTestimonials(prev => prev.filter(t => t.id !== id));
                } catch (error) {
                    console.error('Failed to approve testimonial:', error);
                    alert('Failed to approve testimonial');
                }
            },
            isDestructive: false,
        });
    };

    const handleReject = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Reject Testimonial',
            message: 'Are you sure you want to reject this testimonial? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await contentService.rejectTestimonial(id);
                    setPendingTestimonials(prev => prev.filter(t => t.id !== id));
                } catch (error) {
                    console.error('Failed to reject testimonial:', error);
                    alert('Failed to reject testimonial');
                }
            },
            isDestructive: true,
        });
    };

    return (
        <>
            {/* Quick Actions */}
            <Card hover={false}>
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="primary"
                        onClick={() => setActiveModal('project')}
                    >
                        Add Project
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setActiveModal('skill')}
                    >
                        Add Skill
                    </Button>
                    <Button variant="secondary">Update Resume</Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/contact-info')}>Edit Contact Info</Button>
                </div>
            </Card>

            {/* Pending Testimonials */}
            <Card hover={false}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Pending Testimonials</h2>
                    <span className="text-sm text-[var(--color-warning)] bg-[var(--color-warning)]/20 px-2 py-1 rounded-full">
                        {pendingTestimonials.length} pending
                    </span>
                </div>
                <div className="space-y-4">
                    {pendingTestimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="flex items-start justify-between p-4 bg-[var(--color-surface)] rounded-lg"
                        >
                            <div className="flex-1">
                                <p className="font-medium">{testimonial.authorName || testimonial.name}</p>
                                <p className="text-sm text-[var(--color-text-muted)] line-clamp-1">
                                    {testimonial.content}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                    {testimonial.date || new Date(testimonial.createdAt || '').toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handleApprove(testimonial.id)}
                                    className="px-3 py-1 text-sm bg-[var(--color-success)] text-white rounded-md hover:opacity-90"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(testimonial.id)}
                                    className="px-3 py-1 text-sm bg-[var(--color-error)] text-white rounded-md hover:opacity-90"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Recent Messages */}
            <Card hover={false}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Messages</h2>
                    <a href="/admin/messages" className="text-sm text-[var(--color-primary)] hover:underline">
                        View All
                    </a>
                </div>
                <div className="space-y-3">
                    {recentMessages.map((message) => (
                        <div
                            key={message.id}
                            className="flex items-center justify-between py-3 border-b border-[var(--glass-border)] last:border-0"
                        >
                            <div>
                                <p className="font-medium">{message.name}</p>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    {message.subject}
                                </p>
                            </div>
                            <span className="text-sm text-[var(--color-text-muted)]">
                                {message.date}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Modals */}
            <AddProjectModal
                isOpen={activeModal === 'project'}
                onClose={() => setActiveModal(null)}
            />
            <AddSkillModal
                isOpen={activeModal === 'skill'}
                onClose={() => setActiveModal(null)}
            />

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                isDestructive={confirmation.isDestructive}
            />
        </>
    );
};
