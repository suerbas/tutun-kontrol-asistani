import React from 'react';

interface SOSPanelProps {
    isVisible: boolean;
    onToggle: () => void;
    onFinish: () => void;
}

export const SOSPanel: React.FC<SOSPanelProps> = ({ isVisible, onToggle, onFinish }) => {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={onToggle}
                className="w-16 h-16 bg-red-600 rounded-full shadow-2xl flex items-center justify-center text-white font-bold border-4 border-white animate-pulse"
                aria-label="Acil Durum Kartları"
            >
                SOS
            </button>
            {isVisible && (
                <div className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-2xl border p-4" role="dialog" aria-label="Acil Durum Kartları">
                    <h4 className="font-bold text-red-600 mb-4 border-b pb-2">ACİL DURUM KARTLARI</h4>
                    <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg text-sm">
                            <strong>😭 Ağlarsa:</strong> Sakinleşmesini bekleyin, su teklif edin.
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg text-sm">
                            <strong>😡 Öfke:</strong> "Karar sizin" diyerek geri çekilin.
                        </div>
                        <button
                            onClick={onFinish}
                            className="w-full py-2 bg-red-600 text-white rounded font-bold text-sm"
                        >
                            GÖRÜŞMEYİ BİTİR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
