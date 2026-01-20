import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const AdminLogin: React.FC = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder - would authenticate with backend
        console.log('Admin login:', formData);
        // On success, redirect to dashboard
        window.location.href = '/admin/dashboard';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="section min-h-screen flex items-center justify-center gradient-bg">
            <div className="container mx-auto px-6">
                <div className="max-w-md mx-auto">
                    <div className="glass-card p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                                <span className="text-3xl">🔐</span>
                            </div>
                            <h1 className="text-2xl font-bold">{t('admin.login')}</h1>
                            <p className="text-[var(--color-text-muted)] mt-2">
                                Sign in to manage your portfolio
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    {t('admin.email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="admin@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    {t('admin.password')}
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="••••••••"
                                />
                            </div>

                            <Button type="submit" variant="primary" className="w-full">
                                {t('admin.signIn')}
                            </Button>
                        </form>
                    </div>

                    {/* Back to home */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-sm"
                        >
                            ← Back to Portfolio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
