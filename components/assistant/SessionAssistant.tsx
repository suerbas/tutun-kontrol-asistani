import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Patient } from '../../types';
import { ASSISTANT_TASKS, AssistantTask } from '../../constants/assistant';
import { buildAssistantContext, contextToText, hasMasks, MASK_PATTERN, scrubText } from '../../services/deidentify';
import { Button } from '../Button';

type Guard = { retried: boolean; removedLines: number; notes: string[] };
type Item = { id: number; task: AssistantTask; input: string; answer?: string; guard?: Guard; error?: string };

const MAX_INPUT = 1500;

/** Maskelenmiş parçaları vurgular: [İSİM] gibi. */
const Highlighted: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(new RegExp(`(${MASK_PATTERN.source})`, 'u'));
    return (
        <>
            {parts.map((p, i) =>
                new RegExp(`^${MASK_PATTERN.source}$`, 'u').test(p)
                    ? <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">{p}</mark>
                    : <React.Fragment key={i}>{p}</React.Fragment>
            )}
        </>
    );
};

/** Model yanıtındaki **kalın** ifadeleri ve satırları güvenli biçimde gösterir. */
const Answer: React.FC<{ text: string }> = ({ text }) => (
    <div className="space-y-1 text-sm text-slate-800 leading-relaxed">
        {text.split('\n').map((line, i) => {
            if (!line.trim()) return <div key={i} className="h-1" />;
            const bullet = /^\s*[-*•]\s+/.test(line);
            const clean = line.replace(/^#+\s*/, '').replace(/^\s*[-*•]\s+/, '');
            const segments = clean.split(/(\*\*[^*]+\*\*)/g);
            return (
                <p key={i} className={bullet ? 'pl-4 relative before:content-["•"] before:absolute before:left-1' : ''}>
                    {segments.map((s, j) =>
                        s.startsWith('**') && s.endsWith('**')
                            ? <strong key={j}>{s.slice(2, -2)}</strong>
                            : <React.Fragment key={j}>{s}</React.Fragment>
                    )}
                </p>
            );
        })}
    </div>
);

const callAssistant = async (body: object): Promise<{ text: string; guard?: Guard }> => {
    const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'İstek başarısız oldu.');
    return { text: data.text as string, guard: data.guard };
};

/** Sunucudaki kural denetiminin sonucunu hekime gösterir. */
const GuardNote: React.FC<{ guard?: Guard }> = ({ guard }) => {
    if (!guard) return null;
    if (guard.notes.length) {
        return (
            <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded p-2">
                <strong>Kural denetimi:</strong> {guard.removedLines > 0 ? `${guard.removedLines} satır çıkarıldı. ` : ''}Bu cevabı dikkatle değerlendirin.
                <ul className="list-disc pl-4 mt-1">
                    {guard.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
            </div>
        );
    }
    return (
        <div className="mt-2 text-[11px] text-emerald-700">
            ✓ Kural denetiminden geçti{guard.retried ? ' (ilk cevap kurallara uymadığı için yeniden yazdırıldı)' : ''}.
        </div>
    );
};

export const SessionAssistant: React.FC<{ patient: Patient }> = ({ patient }) => {
    const [open, setOpen] = useState(false);
    const [task, setTask] = useState<AssistantTask>('mi');
    const [draft, setDraft] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [busy, setBusy] = useState(false);
    const [showContext, setShowContext] = useState(false);
    const [copied, setCopied] = useState<number | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    // Danışan değişince konuşma silinir; hiçbir şey kaydedilmez.
    useEffect(() => {
        setItems([]);
        setDraft('');
    }, [patient.id]);

    useEffect(() => {
        if (open) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [items, busy, open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    const context = useMemo(() => buildAssistantContext(patient), [patient]);
    const contextText = useMemo(() => contextToText(context), [context]);
    const taskInfo = ASSISTANT_TASKS.find(t => t.id === task)!;
    const masked = useMemo(() => scrubText(draft.trim()), [draft]);
    const willMask = draft.trim() !== '' && hasMasks(masked) && masked !== draft.trim();
    const canSend = !busy && (taskInfo.inputRequired ? masked.length > 0 : true);

    const send = async () => {
        if (!canSend) return;
        const id = Date.now();
        // Yalnızca maskelenmiş metin gönderilir ve ekranda tutulur.
        const input = masked;
        const history = items
            .filter(i => i.answer)
            .slice(-4)
            .flatMap(i => [
                { role: 'user', text: `${ASSISTANT_TASKS.find(t => t.id === i.task)!.label}: ${i.input || '(not yok)'}` },
                { role: 'assistant', text: i.answer! }
            ]);

        setItems(prev => [...prev, { id, task, input }]);
        setDraft('');
        setBusy(true);
        try {
            const { text: answer, guard } = await callAssistant({ task, input, context, history });
            setItems(prev => prev.map(i => i.id === id ? { ...i, answer, guard } : i));
        } catch (err: any) {
            setItems(prev => prev.map(i => i.id === id ? { ...i, error: err.message } : i));
        } finally {
            setBusy(false);
        }
    };

    const copy = async (item: Item) => {
        try {
            await navigator.clipboard.writeText(item.answer || '');
            setCopied(item.id);
            setTimeout(() => setCopied(null), 1500);
        } catch {
            // Pano erişimi yoksa sessizce geç.
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-xl px-5 py-3 border-4 border-white"
                aria-label="Görüşme asistanını aç"
            >
                <span aria-hidden>🤖</span>
                <span className="hidden sm:inline">Görüşme Asistanı</span>
            </button>

            {open && (
                <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="assistant-title">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
                    <div className="relative w-full sm:w-[460px] h-full bg-white shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b bg-indigo-50">
                            <div>
                                <h2 id="assistant-title" className="font-bold text-indigo-900">Görüşme Asistanı</h2>
                                <p className="text-xs text-indigo-700">Danışan kodu ekranda kalır, modele gönderilmez.</p>
                            </div>
                            <button onClick={() => setOpen(false)} className="text-2xl leading-none text-slate-500 hover:text-slate-800 px-2" aria-label="Kapat">×</button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900">
                                <strong>Gizlilik:</strong> Modele yalnızca anonim özet gider: yaş grubu, cinsiyet, sigara ve klinik bilgiler. Kod, tarih, tam yaş ve kişi/yer adları gönderilmez; yazdıklarınız gönderilmeden önce maskelenir. Konuşma kaydedilmez.
                                <button onClick={() => setShowContext(v => !v)} className="block mt-2 font-semibold underline">
                                    {showContext ? 'Gönderilen özeti gizle' : 'Gönderilen özeti göster'}
                                </button>
                                {showContext && (
                                    <pre className="mt-2 whitespace-pre-wrap font-sans text-[11px] bg-white border rounded p-2 text-slate-700">
                                        <Highlighted text={contextText} />
                                    </pre>
                                )}
                            </div>

                            {items.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    Görüşme sırasında danışanın söylediğini yazın; motivasyonel görüşmeye uygun yanıt, düşünce analizi veya sonraki adım önerisi alın.
                                </p>
                            )}

                            {items.map(item => {
                                const info = ASSISTANT_TASKS.find(t => t.id === item.task)!;
                                return (
                                    <div key={item.id} className="space-y-2">
                                        <div className="ml-8 bg-indigo-600 text-white rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap">
                                            <div className="text-[10px] font-bold uppercase opacity-80 mb-1">{info.icon} {info.label}</div>
                                            {item.input || <span className="italic opacity-80">(yalnızca danışan özeti)</span>}
                                        </div>
                                        {item.answer && (
                                            <div className="mr-4 bg-gray-50 border rounded-2xl px-3 py-2">
                                                <Answer text={item.answer} />
                                                <GuardNote guard={item.guard} />
                                                <button onClick={() => copy(item)} className="mt-2 text-xs text-indigo-700 font-semibold hover:underline">
                                                    {copied === item.id ? 'Kopyalandı ✓' : 'Kopyala'}
                                                </button>
                                            </div>
                                        )}
                                        {item.error && (
                                            <div className="mr-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-2 text-sm">{item.error}</div>
                                        )}
                                    </div>
                                );
                            })}
                            {busy && <div className="text-sm text-gray-500 italic">Asistan düşünüyor…</div>}
                            <div ref={endRef} />
                        </div>

                        <div className="border-t p-3 space-y-2 bg-white">
                            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Asistan görevi">
                                {ASSISTANT_TASKS.map(t => (
                                    <button
                                        key={t.id}
                                        role="tab"
                                        aria-selected={task === t.id}
                                        onClick={() => setTask(t.id)}
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${task === t.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-gray-300 hover:border-indigo-400'}`}
                                    >
                                        {t.icon} {t.label}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                                rows={3}
                                maxLength={MAX_INPUT}
                                placeholder={taskInfo.placeholder}
                                value={draft}
                                disabled={busy}
                                onChange={e => setDraft(e.target.value)}
                                onKeyDown={e => {
                                    // Enter gönderir, Shift+Enter yeni satır açar (Türkçe klavyede harf birleştirme sırasında gönderilmez).
                                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                                        e.preventDefault();
                                        if (canSend) send();
                                    }
                                }}
                            />
                            {willMask && (
                                <div className="text-xs bg-amber-50 border border-amber-200 rounded p-2 text-amber-900">
                                    <strong>Gönderilecek hali:</strong> <Highlighted text={masked} />
                                </div>
                            )}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] text-gray-500">Enter: gönder · Shift+Enter: yeni satır. Öneriler klinik kararın yerini tutmaz.</span>
                                <div className="flex gap-2">
                                    {items.length > 0 && (
                                        <Button variant="secondary" onClick={() => setItems([])} disabled={busy} className="py-1.5 px-3 text-sm">Temizle</Button>
                                    )}
                                    <Button onClick={send} disabled={!canSend} className="py-1.5 px-4 text-sm">Sor</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
