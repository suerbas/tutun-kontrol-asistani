import React from 'react';
import { Button } from '../Button';

interface SuccessScreenProps {
    isReady: boolean | null;
    onBack: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ isReady, onBack }) => (
    <div className="bg-white p-12 rounded-xl shadow-sm max-w-2xl mx-auto text-center mt-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Kayıt Başarılı</h2>
        <p className="text-slate-500 mb-8">
            Danışan için <strong>{isReady ? '5A Modeli' : '5R Modeli'}</strong> başarıyla uygulandı ve tedavi planı oluşturuldu.
        </p>
        <Button onClick={onBack}>Danışan Listesine Dön</Button>
    </div>
);
