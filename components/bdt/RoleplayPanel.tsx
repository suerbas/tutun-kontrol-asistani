import React, { useEffect, useRef, useState } from 'react';
import { ROLEPLAY_PERSONAS, RoleplayPersona } from '../../constants/roleplay';
import { Button } from '../Button';

type Turn = { role: 'clinician' | 'client'; text: string };

const callRoleplayApi = async (body: object): Promise<string> => {
    const res = await fetch('/api/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'İstek başarısız oldu.');
    return data.text as string;
};

export const RoleplayPanel: React.FC = () => {
    const [persona, setPersona] = useState<RoleplayPersona | null>(null);
    const [turns, setTurns] = useState<Turn[]>([]);
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [turns, busy]);

    const startScenario = (p: RoleplayPersona) => {
        setPersona(p);
        setTurns([{ role: 'client', text: p.opening }]);
        setDraft('');
        setError(null);
        setFeedback(null);
    };

    const resetScenario = () => {
        setPersona(null);
        setTurns([]);
        setDraft('');
        setError(null);
        setFeedback(null);
    };

    const send = async () => {
        const text = draft.trim();
        if (!persona || !text || busy) return;
        const next: Turn[] = [...turns, { role: 'clinician', text }];
        setTurns(next);
        setDraft('');
        setBusy(true);
        setError(null);
        try {
            const reply = await callRoleplayApi({ personaId: persona.id, mode: 'reply', turns: next });
            setTurns(prev => [...prev, { role: 'client', text: reply }]);
        } catch (err: any) {
            // Hata durumunda hekimin mesajı geri gelir; tekrar gönderebilir.
            setTurns(turns);
            setDraft(text);
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    const requestFeedback = async () => {
        if (!persona || turns.length < 3 || busy) return;
        setBusy(true);
        setError(null);
        try {
            const text = await callRoleplayApi({ personaId: persona.id, mode: 'feedback', turns });
            setFeedback(text);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    const notice = (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-sm mb-4">
            <strong>Kurgusal senaryo.</strong> Gerçek hasta bilgisi girmeyin. Yapay zekâ danışanı canlandırır ve geri bildirim verir; bu bir eğitim aracıdır, klinik karar için kullanılmaz.
        </div>
    );

    if (!persona) {
        return (
            <div>
                {notice}
                <p className="text-gray-600 mb-4">
                    Bir danışan senaryosu seçin. Yapay zekâ o danışanı canlandırır; siz motivasyonel görüşme becerilerinizi deneyin ve sonunda geri bildirim alın.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    {ROLEPLAY_PERSONAS.map(p => (
                        <div key={p.id} className="border rounded-xl p-4 bg-white flex flex-col">
                            <h3 className="font-bold text-indigo-900">{p.name}</h3>
                            <p className="text-sm text-gray-700 mt-2">{p.summary}</p>
                            <p className="text-xs text-indigo-700 mt-2"><strong>Odak:</strong> {p.focus}</p>
                            <div className="mt-4">
                                <Button onClick={() => startScenario(p)} className="w-full md:w-auto">Senaryoyu başlat</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const canFeedback = turns.some(t => t.role === 'clinician') && turns.length >= 3 && !busy;

    return (
        <div className="flex flex-col gap-4">
            {notice}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Danışan</p>
                    <h3 className="font-bold text-indigo-900">{persona.name}</h3>
                </div>
                <Button variant="secondary" onClick={resetScenario}>Senaryoyu değiştir</Button>
            </div>

            <div className="bg-gray-50 border rounded-xl p-4 h-72 overflow-y-auto space-y-3" aria-live="polite">
                {turns.map((t, i) => (
                    <div key={i} className={`flex ${t.role === 'clinician' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${t.role === 'clinician' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-800'}`}>
                            <div className="text-[10px] font-bold uppercase opacity-70 mb-1">{t.role === 'clinician' ? 'Siz (hekim)' : 'Danışan'}</div>
                            {t.text}
                        </div>
                    </div>
                ))}
                {busy && <div className="text-sm text-gray-500 italic">Danışan yanıt yazıyor…</div>}
                <div ref={endRef} />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">{error}</div>}

            <div className="flex flex-col gap-2">
                <textarea
                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    maxLength={800}
                    placeholder="Danışana ne dersiniz?"
                    value={draft}
                    disabled={busy}
                    onChange={e => setDraft(e.target.value)}
                />
                <div className="flex flex-wrap gap-3 justify-between items-center">
                    <Button variant="outline" onClick={requestFeedback} disabled={!canFeedback}>
                        Geri bildirim al
                    </Button>
                    <Button onClick={send} disabled={busy || !draft.trim()}>Gönder</Button>
                </div>
            </div>

            {feedback && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                    <h4 className="font-bold text-indigo-900 mb-2">Geri bildirim</h4>
                    <div className="text-sm text-slate-800 whitespace-pre-wrap">{feedback}</div>
                </div>
            )}
        </div>
    );
};
