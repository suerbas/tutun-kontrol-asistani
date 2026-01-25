import React, { useState } from 'react';
import { COGNITIVE_DISTORTIONS, EMOTIONS, CBT_CLIENT_RESISTANCE, COPING_TECHNIQUES } from '../constants';
import { ThoughtRecord, Patient } from '../types';
import { Button } from './Button';
import { patientService } from '../services/patientService';

interface CBTToolsProps {
    patient: Patient;
    onClose: () => void;
    onUpdatePatient: (patient: Patient) => void;
}

type TabType = 'distortions' | 'thought-record' | 'records' | 'resistance' | 'coping';

export const CBTTools: React.FC<CBTToolsProps> = ({ patient, onClose, onUpdatePatient }) => {
    const [activeTab, setActiveTab] = useState<TabType>('distortions');
    const [showForm, setShowForm] = useState(false);
    const [expandedDistortion, setExpandedDistortion] = useState<string | null>(null);
    const [expandedResistance, setExpandedResistance] = useState<string | null>(null);
    const [expandedTechnique, setExpandedTechnique] = useState<string | null>(null);
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
        onUpdatePatient(updatedPatient);
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
        setActiveTab('records');
    };

    const getEmotionName = (id: string) => EMOTIONS.find(e => e.id === id)?.name || id;
    const getDistortionName = (id: string) => COGNITIVE_DISTORTIONS.find(d => d.id === id)?.name || id;

    const tabs = [
        { id: 'distortions' as TabType, label: '📚 Bilişsel Çarpıtmalar', count: COGNITIVE_DISTORTIONS.length },
        { id: 'resistance' as TabType, label: '🛡️ Direnç Rehberi', count: CBT_CLIENT_RESISTANCE.length },
        { id: 'coping' as TabType, label: '🧘 Baş Etme', count: COPING_TECHNIQUES.length },
        { id: 'thought-record' as TabType, label: '✏️ Düşünce Kaydı', count: null },
        { id: 'records' as TabType, label: '📋 Kayıtlar', count: existingRecords.length }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-indigo-600 text-white p-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            🧠 BDT Araçları
                        </h2>
                        <p className="text-indigo-200 text-sm mt-1">Bilişsel Davranışçı Terapi Yardımcıları - Zenginleştirilmiş</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b bg-gray-100 overflow-x-auto flex-shrink-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-5 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 border-b-2 -mb-px ${activeTab === tab.id
                                ? 'text-indigo-600 border-indigo-600 bg-white'
                                : 'text-gray-600 border-transparent hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {/* Bilişsel Çarpıtmalar Tab - ZENGİNLEŞTİRİLMİŞ */}
                    {activeTab === 'distortions' && (
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-4">
                                Danışanınızın düşünce kalıplarını tanımlamak için bilişsel çarpıtmaları kullanın. Her çarpıtmaya tıklayarak detaylı rehberi görün.
                            </p>
                            <div className="grid gap-4">
                                {COGNITIVE_DISTORTIONS.map((distortion) => (
                                    <div key={distortion.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                        <button
                                            onClick={() => setExpandedDistortion(expandedDistortion === distortion.id ? null : distortion.id)}
                                            className="w-full p-4 text-left flex justify-between items-start hover:bg-gray-50"
                                        >
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-indigo-800 text-lg">{distortion.name}</h3>
                                                <p className="text-gray-600 text-sm mt-1">{distortion.description}</p>
                                            </div>
                                            <span className={`text-xl transition-transform ${expandedDistortion === distortion.id ? 'rotate-180' : ''}`}>▼</span>
                                        </button>

                                        {expandedDistortion === distortion.id && (
                                            <div className="border-t bg-gray-50 p-4 space-y-4">
                                                {/* Sigara Örneği */}
                                                <div className="bg-red-50 p-3 rounded-lg">
                                                    <p className="text-red-800 text-sm font-medium">💭 Sigara Örneği:</p>
                                                    <p className="text-red-700 text-sm italic">{distortion.smokingExample}</p>
                                                </div>

                                                {/* Meydan Okuma */}
                                                <div className="bg-green-50 p-3 rounded-lg">
                                                    <p className="text-green-800 text-sm font-medium">💡 Meydan Okuma:</p>
                                                    <p className="text-green-700 text-sm">{distortion.challenge}</p>
                                                </div>

                                                {/* Danışan Reaksiyonları */}
                                                {distortion.clientReactions && (
                                                    <div className="bg-orange-50 p-3 rounded-lg">
                                                        <p className="text-orange-800 text-sm font-bold mb-2">🗣️ Olası Danışan Reaksiyonları:</p>
                                                        <div className="space-y-3">
                                                            {distortion.clientReactions.map((cr, idx) => (
                                                                <div key={idx} className="bg-white p-3 rounded border border-orange-200">
                                                                    <p className="text-orange-900 text-sm font-medium italic">"{cr.reaction.replace(/"/g, '')}"</p>
                                                                    <p className="text-orange-700 text-sm mt-1">→ {cr.response}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Terapötik Sorular */}
                                                {distortion.therapeuticQuestions && (
                                                    <div className="bg-blue-50 p-3 rounded-lg">
                                                        <p className="text-blue-800 text-sm font-bold mb-2">❓ Sokratik Sorular:</p>
                                                        <ul className="space-y-1">
                                                            {distortion.therapeuticQuestions.map((q, idx) => (
                                                                <li key={idx} className="text-blue-700 text-sm">• {q}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Baş Etme Stratejileri */}
                                                {distortion.copingStrategies && (
                                                    <div className="bg-purple-50 p-3 rounded-lg">
                                                        <p className="text-purple-800 text-sm font-bold mb-2">🛠️ Baş Etme Stratejileri:</p>
                                                        <ul className="space-y-1">
                                                            {distortion.copingStrategies.map((s, idx) => (
                                                                <li key={idx} className="text-purple-700 text-sm">• {s}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Direnç Rehberi Tab - YENİ */}
                    {activeTab === 'resistance' && (
                        <div className="space-y-4">
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                                <h3 className="font-bold text-amber-900 mb-1">🛡️ Danışan Direnç Rehberi</h3>
                                <p className="text-amber-800 text-sm">
                                    Danışanlardan sıkça duyulan direnç ifadeleri ve bunlara karşı kullanılabilecek terapötik yanıtlar.
                                    Her ifadeye tıklayarak detaylı müdahale stratejilerini görün.
                                </p>
                            </div>
                            <div className="grid gap-3">
                                {CBT_CLIENT_RESISTANCE.map((item) => (
                                    <div key={item.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                        <button
                                            onClick={() => setExpandedResistance(expandedResistance === item.id ? null : item.id)}
                                            className="w-full p-4 text-left flex justify-between items-start hover:bg-gray-50"
                                        >
                                            <div className="flex-grow">
                                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">{item.category}</span>
                                                <p className="font-bold text-gray-800 mt-2 text-lg italic">"{item.statement.replace(/"/g, '')}"</p>
                                            </div>
                                            <span className={`text-xl transition-transform ml-2 ${expandedResistance === item.id ? 'rotate-180' : ''}`}>▼</span>
                                        </button>

                                        {expandedResistance === item.id && (
                                            <div className="border-t bg-gray-50 p-4 space-y-4">
                                                {/* Empatik Yanıt */}
                                                <div className="bg-teal-50 p-3 rounded-lg border-l-4 border-teal-500">
                                                    <p className="text-teal-800 text-sm font-bold">💚 Empatik Yanıt:</p>
                                                    <p className="text-teal-700 text-sm mt-1 italic">"{item.empatheticResponse}"</p>
                                                </div>

                                                {/* Sokratik Soru */}
                                                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                                    <p className="text-blue-800 text-sm font-bold">❓ Sokratik Soru:</p>
                                                    <p className="text-blue-700 text-sm mt-1">"{item.socraticQuestion}"</p>
                                                </div>

                                                {/* MI Tekniği */}
                                                <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                                                    <p className="text-purple-800 text-sm font-bold">🎯 Motivasyonel Görüşme (MI) Tekniği:</p>
                                                    <p className="text-purple-700 text-sm mt-1">{item.miTechnique}</p>
                                                </div>

                                                {/* Alternatif Bakış Açısı */}
                                                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                                                    <p className="text-green-800 text-sm font-bold">💡 Alternatif Bakış Açısı:</p>
                                                    <p className="text-green-700 text-sm mt-1">{item.alternativePerspective}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Baş Etme Teknikleri Tab - YENİ */}
                    {activeTab === 'coping' && (
                        <div className="space-y-4">
                            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200 mb-4">
                                <h3 className="font-bold text-cyan-900 mb-1">🧘 Baş Etme Teknikleri</h3>
                                <p className="text-cyan-800 text-sm">
                                    Sigara isteği anlarında danışana öğretilebilecek pratik teknikler. Her tekniğe tıklayarak adım adım talimatları görün.
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {COPING_TECHNIQUES.map((technique) => (
                                    <div key={technique.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                                        <button
                                            onClick={() => setExpandedTechnique(expandedTechnique === technique.id ? null : technique.id)}
                                            className="w-full p-4 text-left hover:bg-gray-50"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-3xl">{technique.icon}</span>
                                                <div className="flex-grow">
                                                    <h3 className="font-bold text-gray-800">{technique.name}</h3>
                                                    <p className="text-xs text-gray-500 italic">{technique.englishName}</p>
                                                    <p className="text-gray-600 text-sm mt-1">{technique.description}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">⏱️ {technique.duration}</span>
                                                    </div>
                                                </div>
                                                <span className={`text-lg transition-transform ${expandedTechnique === technique.id ? 'rotate-180' : ''}`}>▼</span>
                                            </div>
                                        </button>

                                        {expandedTechnique === technique.id && (
                                            <div className="border-t bg-gray-50 p-4 space-y-3">
                                                <div className="bg-blue-50 p-3 rounded-lg">
                                                    <p className="text-blue-800 text-sm font-bold mb-1">📍 Ne Zaman Kullanılır:</p>
                                                    <p className="text-blue-700 text-sm">{technique.whenToUse}</p>
                                                </div>

                                                <div className="bg-white rounded-lg border p-3">
                                                    <p className="text-gray-800 text-sm font-bold mb-2">📋 Adımlar:</p>
                                                    <div className="space-y-2">
                                                        {technique.steps.map((step, idx) => (
                                                            <div key={idx} className="flex gap-3 items-start">
                                                                <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                                                                <div>
                                                                    <p className="font-medium text-gray-800 text-sm">{step.step}</p>
                                                                    <p className="text-gray-600 text-sm">{step.instruction}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
