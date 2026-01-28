import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Card } from '../ui/Card';
import { authService } from '../../services/auth.service';
import { eventBus } from '../../utils/eventBus';
import { StatusModal } from '../ui/StatusModal';

export const AdminLayout: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    useEffect(() => {
        const handleSessionExpired = () => setIsSessionExpired(true);
        eventBus.on('auth:session-expired', handleSessionExpired);
        return () => {
            eventBus.off('auth:session-expired', handleSessionExpired);
        };
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const handleSessionExpiredClose = () => {
        setIsSessionExpired(false);
        handleLogout();
    };

    const menuItems = [
        { icon: '📊', label: 'Dashboard', count: null, path: '/admin/dashboard' },
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

    return (
        <div className="section min-h-screen gradient-bg">
            <StatusModal
                isOpen={isSessionExpired}
                onClose={handleSessionExpiredClose}
                type="error"
                title="Session Expired"
                message="Your session has expired. Please log in again to continue."
            />
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
                                {menuItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.label}
                                            to={item.path}
                                            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? 'bg-[var(--color-primary)] text-white'
                                                : 'hover:bg-[var(--color-surface)]'
                                                }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span>{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                            </span>
                                            {item.count !== null && (
                                                <span className={`text-sm px-2 py-0.5 rounded-full ${isActive
                                                    ? 'bg-white/20'
                                                    : 'text-[var(--color-text-muted)] bg-[var(--color-surface)]'
                                                    }`}>
                                                    {item.count}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                                >
                                    <span>🌐</span>
                                    <span>View Portfolio</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <span>🚪</span>
                                    <span>{t('nav.logout')}</span>
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};
