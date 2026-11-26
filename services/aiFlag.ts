// Yapay zekâ özelliklerinin (görüşme asistanı, rol oyunu) açık olup olmadığı.
// Vercel'de VITE_AI_DISABLED=1 tanımlanıp yeniden derlenirse düğmeler ve sekme gizlenir.
// Sunucu tarafında da AI_DISABLED=1 istekleri modele göndermeden reddeder (bkz. api/_lib/openrouter.ts).
export const AI_ENABLED = (import.meta as any).env?.VITE_AI_DISABLED !== '1';
