import React from 'react';
import { Button } from '../Button';

interface FinishModalProps {
    isVisible: boolean;
    homework: string;
    score?: number;
    onCancel: () => void;
    onSave: () => void;
}

export const FinishModal: React.FC<FinishModalProps> = ({
    isVisible,
    homework,
    score,
    onCancel,
    onSave
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="finish-modal-title">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    🏁
                </div>
                <h2 id="finish-modal-title" className="text-2xl font-bold mb-2">Görüşme Tamamlandı</h2>
                <div className="bg-gray-50 p-4 rounded-lg text-left text-sm mb-6 border">
                    <p><strong>Yeni Ödev:</strong> {homework || "Gözlem Ödevi"}</p>
                    <p><strong>Hazır Oluş Skoru:</strong> {score ?? 'Belirtilmedi'}</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <Button variant="secondary" onClick={onCancel}>İptal</Button>
                    <Button onClick={onSave} className="bg-green-600">Kaydet ve Çık</Button>
                </div>
            </div>
        </div>
    );
};
