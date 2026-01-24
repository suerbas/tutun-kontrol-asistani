import React, { useState } from 'react';
import { COGNITIVE_DISTORTIONS, EMOTIONS } from '../constants';
import { ThoughtRecord, Patient } from '../types';
import { Button } from './Button';
import { patientService } from '../services/patientService';

interface CBTToolsProps {
    patient: Patient;
    onClose: () => void;
}

export const CBTTools: React.FC<CBTToolsProps> = ({ patient, onClose }) => {
    const [activeTab, setActiveTab] = useState<'distortions' | 'thought-record' | 'records'>('distortions');
    const [showForm, setShowForm] = useState(false);
    const [thoughtRecordForm, setThoughtRecordForm] = useState({
        trigger: '',
        automaticThought: '',
        emotion: '',
        emotionIntensity: 5,
        cognitiveDistortion: '',
        alternativeThought: '',
        newEmotionIntensity: 5
    });

    const existingRecords = patient.psychosocialStatus?.thoughtRecords || [];

    const handleSaveThoughtRecord = () => {
        if (!thoughtRecordForm.trigger || !thoughtRecordForm.automaticThought) {
            alert('Lütfen en az tetikleyici ve otomatik düşünce alanlarını doldurun.');
            return;
        }

        const newRecord: ThoughtRecord = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('tr-TR'),
            ...thoughtRecordForm
        };

        const updatedPatient: Patient = {
            ...patient,
            psychosocialStatus: {
                ...patient.psychosocialStatus!,
                thoughtRecords: [...existingRecords, newRecord]
            }
        };

        patientService.savePatient(updatedPatient);
        setShowForm(false);
        setThoughtRecordForm({
            trigger: '',
            automaticThought: '',
            emotion: '',
            emotionIntensity: 5,
            cognitiveDistortion: '',
            alternativeThought: '',
            newEmotionIntensity: 5
        });
        // Force refresh by closing and reopening would be ideal, but for now just show records
        setActiveTab('records');
    };

    const getEmotionName = (id: string) => EMOTIONS.find(e => e.id === id)?.name || id;
    const getDistortionName = (id: string) => COGNITIVE_DISTORTIONS.find(d => d.id === id)?.name || id;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-indigo-600 text-white p-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            🧠 BDT Araçları
                        </h2>
                        <p className="text-indigo-200 text-sm mt-1">Bilişsel Davranışçı Terapi Yardımcıları</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b bg-gray-50">
                    <button
                        onClick={() => setActiveTab('distortions')}
                        className={`flex-1 py-3 px-4 font-medium text-sm transition-all ${activeTab === 'distortions'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        📚 Bilişsel Çarpıtmalar
                    </button>
                    <button
                        onClick={() => setActiveTab('thought-record')}
                        className={`flex-1 py-3 px-4 font-medium text-sm transition-all ${activeTab === 'thought-record'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        ✏️ Düşünce Kaydı
                    </button>
                    <button
                        onClick={() => setActiveTab('records')}
                        className={`flex-1 py-3 px-4 font-medium text-sm transition-all ${activeTab === 'records'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        📋 Kayıtlar ({existingRecords.length})
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {/* Bilişsel Çarpıtmalar Tab */}
                    {activeTab === 'distortions' && (
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-4">
                                Danışanınızın düşünce kalıplarını tanımlamak için aşağıdaki bilişsel çarpıtmaları kullanabilirsiniz.
                            </p>
                            <div className="grid gap-4">
                                {COGNITIVE_DISTORTIONS.map((distortion) => (
                                    <div key={distortion.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <h3 className="font-bold text-indigo-800 text-lg">{distortion.name}</h3>
                                        <p className="text-gray-600 text-sm mt-1">{distortion.description}</p>
                                        <div className="mt-3 bg-red-50 p-3 rounded-lg">
                                            <p className="text-red-800 text-sm font-medium">💭 Sigara Örneği:</p>
                                            <p className="text-red-700 text-sm italic">{distortion.smokingExample}</p>
                                        </div>
                                        <div className="mt-2 bg-green-50 p-3 rounded-lg">
                                            <p className="text-green-800 text-sm font-medium">💡 Meydan Okuma:</p>
                                            <p className="text-green-700 text-sm">{distortion.challenge}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Düşünce Kaydı Tab */}
                    {activeTab === 'thought-record' && (
                        <div>
                            {!showForm ? (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Düşünce Kaydı</h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        Danışanınızın sigara isteği anında yaşadığı düşünce ve duyguları kaydedin.
                                        Bu kayıtlar otomatik düşünceleri fark etmeye ve çürütmeye yardımcı olur.
                                    </p>
                                    <Button onClick={() => setShowForm(true)}>
                                        + Yeni Kayıt Ekle
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Yeni Düşünce Kaydı</h3>

                                    {/* Tetikleyici */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            1. Tetikleyici Durum <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            placeholder="Ne oluyordu? Neredeydiniz? Kimlerle?"
                                            value={thoughtRecordForm.trigger}
                                            onChange={(e) => setThoughtRecordForm({ ...thoughtRecordForm, trigger: e.target.value })}
                                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Otomatik Düşünce */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            2. Otomatik Düşünce <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            placeholder="O an aklınızdan ne geçti?"
                                            value={thoughtRecordForm.automaticThought}
                                            onChange={(e) => setThoughtRecordForm({ ...thoughtRecordForm, automaticThought: e.target.value })}
                                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Duygu */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">3. Duygu</label>
                                            <select
                                                value={thoughtRecordForm.emotion}
                                                onChange={(e) => setThoughtRecordForm({ ...thoughtRecordForm, emotion: e.target.value })}
                                                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Seçiniz...</option>
                                                {EMOTIONS.map((emotion) => (
                                                    <option key={emotion.id} value={emotion.id}>
                                                        {emotion.icon} {emotion.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Duygu Yoğunluğu: {thoughtRecordForm.emotionIntensity}/10
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                value={thoughtRecordForm.emotionIntensity}
                                                onChange={(e) => setThoughtRecordForm({ ...thoughtRecordForm, emotionIntensity: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                        </div>
                                    </div>

                                    {/* Bilişsel Çarpıtma */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">4. Bilişsel Çarpıtma</label>
                                        <select
                                            value={thoughtRecordForm.cognitiveDistortion}
                                            onChange={(e) => setThoughtRecordForm({ ...thoughtRecordForm, cognitiveDistortion: e.target.value })}
                                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Seçiniz...</option>
                                            {COGNITIVE_DISTORTIONS.map((distortion) => (
                                                <option key={distortion.id} value={distortion.id}>
                                                    {distortion.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Alternatif Düşünce */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            5. Alternatif / Dengeli Düşünce
                                        </label>
                                        <textarea
                                            placeholder="Bu durumu başka nasıl yorumlayabilirsiniz?"
                                            value={thoughtRecordForm.alternativeThought}
                                            onChange={(e) => setThoughtRecordForm({ ...thoughtRecordForm, alternativeThought: e.target.value })}
                                            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={2}
                                        />
                                    </div>

                                    {/* Yeni Duygu Yoğunluğu */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            6. Yeni Duygu Yoğunluğu: {thoughtRecordForm.newEmotionIntensity}/10
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={thoughtRecordForm.newEmotionIntensity}
                                            onChange={(e) => setThoughtRecordForm({ ...thoughtRecordForm, newEmotionIntensity: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button onClick={handleSaveThoughtRecord}>
                                            💾 Kaydı Kaydet
                                        </Button>
                                        <Button variant="secondary" onClick={() => setShowForm(false)}>
                                            İptal
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Kayıtlar Tab */}
                    {activeTab === 'records' && (
                        <div>
                            {existingRecords.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="text-5xl mb-3">📋</div>
                                    <p>Henüz düşünce kaydı yok.</p>
                                    <button
                                        onClick={() => { setActiveTab('thought-record'); setShowForm(true); }}
                                        className="text-indigo-600 hover:underline mt-2"
                                    >
                                        İlk kaydı ekle →
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {existingRecords.map((record, index) => (
                                        <div key={record.id} className="border rounded-xl p-4 bg-gray-50">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-medium">
                                                    #{index + 1} - {record.date}
                                                </span>
                                                {record.cognitiveDistortion && (
                                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                                        {getDistortionName(record.cognitiveDistortion)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <p><strong>Tetikleyici:</strong> {record.trigger}</p>
                                                <p><strong>Otomatik Düşünce:</strong> <span className="text-red-700">{record.automaticThought}</span></p>
                                                {record.emotion && (
                                                    <p><strong>Duygu:</strong> {getEmotionName(record.emotion)} (Yoğunluk: {record.emotionIntensity}/10)</p>
                                                )}
                                                {record.alternativeThought && (
                                                    <p><strong>Alternatif Düşünce:</strong> <span className="text-green-700">{record.alternativeThought}</span></p>
                                                )}
                                                {record.newEmotionIntensity && (
                                                    <p><strong>Yeni Yoğunluk:</strong> {record.newEmotionIntensity}/10
                                                        {record.newEmotionIntensity < record.emotionIntensity &&
                                                            <span className="text-green-600 ml-2">↓ Azaldı</span>
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
