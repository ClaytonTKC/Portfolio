import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const AdminDashboard: React.FC = () => {
    const { t } = useTranslation();

    const menuItems = [
        { icon: '💼', label: 'Skills', count: 10, path: '/admin/skills' },
        { icon: '📁', label: 'Projects', count: 6, path: '/admin/projects' },
        { icon: '🏢', label: 'Experience', count: 3, path: '/admin/experience' },
        { icon: '🎓', label: 'Education', count: 2, path: '/admin/education' },
        { icon: '🎨', label: 'Hobbies', count: 6, path: '/admin/hobbies' },
        { icon: '📄', label: 'Resume', count: null, path: '/admin/resume' },
        { icon: '📞', label: 'Contact Info', count: null, path: '/admin/contact-info' },
        { icon: '💬', label: 'Testimonials', count: 4, path: '/admin/testimonials' },
        { icon: '✉️', label: 'Messages', count: 12, path: '/admin/messages' },
    ];

    const pendingTestimonials = [
        { id: '1', name: 'New User', content: 'Great portfolio!', date: '2 hours ago' },
        { id: '2', name: 'Client X', content: 'Amazing work on our project...', date: '1 day ago' },
    ];

    const recentMessages = [
        { id: '1', name: 'Clay Smith', email: 'john@example.com', subject: 'Project inquiry', date: '1 hour ago' },
        { id: '2', name: 'Jane Doe', email: 'jane@example.com', subject: 'Collaboration opportunity', date: '3 hours ago' },
    ];

    return (
        <div className="section min-h-screen gradient-bg">
            <div className="container mx-auto px-6">
                <div className="pt-8 pb-8">
                    <h1 className="section-title">{t('admin.dashboard')}</h1>
                    <p className="section-subtitle mb-0">{t('admin.manageContent')}</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card hover={false} className="p-4">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--glass-border)]">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                    <span className="text-xl">👤</span>
                                </div>
                                <div>
                                    <p className="font-semibold">Admin</p>
                                    <p className="text-sm text-[var(--color-text-muted)]">Portfolio Owner</p>
                                </div>
                            </div>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.path}
                                        className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-surface)]"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span>{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </span>
                                        {item.count !== null && (
                                            <span className="text-sm text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-0.5 rounded-full">
                                                {item.count}
                                            </span>
                                        )}
                                    </a>
                                ))}
                            </nav>
                            <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
                                <a
                                    href="/"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                                >
                                    <span>🌐</span>
                                    <span>View Portfolio</span>
                                </a>
                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-surface)] transition-colors">
                                    <span>🚪</span>
                                    <span>{t('nav.logout')}</span>
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Quick Actions */}
                        <Card hover={false}>
                            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="primary">Add Project</Button>
                                <Button variant="secondary">Add Skill</Button>
                                <Button variant="secondary">Update Resume</Button>
                                <Button variant="secondary">Edit Contact Info</Button>
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
                                            <p className="font-medium">{testimonial.name}</p>
                                            <p className="text-sm text-[var(--color-text-muted)] line-clamp-1">
                                                {testimonial.content}
                                            </p>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                                {testimonial.date}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button className="px-3 py-1 text-sm bg-[var(--color-success)] text-white rounded-md hover:opacity-90">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1 text-sm bg-[var(--color-error)] text-white rounded-md hover:opacity-90">
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
                    </div>
                </div>
            </div>
        </div>
    );
};
