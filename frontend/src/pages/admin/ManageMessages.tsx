import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { contentService, type Message } from '../../services/content.service';

export const ManageMessages: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
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
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await contentService.getMessages();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkRead = async (id: string) => {
        try {
            await contentService.markMessageRead(id);
            setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmation({
            isOpen: true,
            title: 'Delete Message',
            message: 'Are you sure you want to delete this message? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await contentService.deleteMessage(id);
                    setMessages(messages.filter(m => m.id !== id));
                } catch (error) {
                    console.error('Failed to delete message:', error);
                }
            },
            isDestructive: true,
        });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Manage Messages</h1>

            <div className="grid gap-4">
                {messages.map((message) => (
                    <Card key={message.id} hover={false} className={message.read ? 'opacity-75' : ''}>
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{message.name}</h3>
                                    {!message.read && (
                                        <span className="text-xs bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full">
                                            New
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-[var(--color-text-muted)] mb-1">{message.email}</p>
                                <p className="font-medium mb-2">{message.subject}</p>
                                <p className="text-[var(--color-text-muted)] mb-2 whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                    {new Date(message.createdAt || message.date).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {!message.read && (
                                    <Button variant="secondary" className="text-sm px-3 py-1" onClick={() => handleMarkRead(message.id)}>
                                        Mark Read
                                    </Button>
                                )}
                                <Button variant="secondary" className="text-sm px-3 py-1 hover:bg-[var(--color-error)] hover:text-white" onClick={() => handleDelete(message.id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            {messages.length === 0 && (
                <p className="text-[var(--color-text-muted)] text-center">No messages found.</p>
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
