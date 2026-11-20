
import React, { useState } from 'react';
import { PHARMACOLOGICAL_TREATMENTS } from '../constants';

export const EducationModule: React.FC = () => {
    const [activeModule, setActiveModule] = useState<number>(1);

    const modules = [
        { id: 1, title: '1. Vizyon & MPOWER', icon: '🌍' },
        { id: 2, title: '2. Fizyoloji & Değerlendirme', icon: '🧠' },
        { id: 3, title: '3. Temel Müdahale (5A/5R)', icon: '📋' },
        { id: 4, title: '4. Motivasyonel Görüşme', icon: '🤝' },
        { id: 5, title: '5. BDT & Baş Etme', icon: '🛡️' },
        { id: 6, title: '6. Farmakolojik Tedavi', icon: '💊' },
        { id: 7, title: '7. Özel Gruplar', icon: '⚠️' },
        { id: 8, title: '8. İzlem & Relaps', icon: '🔄' },
    ];

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden min-h-[85vh] flex flex-col md:flex-row border border-gray-200">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-1/4 bg-slate-50 border-r border-gray-200 p-4">
                <h2 className="text-xl font-bold text-slate-800 mb-6 px-2 flex items-center">
                    <span className="bg-teal-600 text-white rounded p-1 mr-2 text-sm">TR</span>
                    Eğitim Müfredatı
                </h2>
                <div className="space-y-2">
                    {modules.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveModule(m.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${activeModule === m.id
                                    ? 'bg-teal-600 text-white shadow-md transform translate-x-1'
                                    : 'text-slate-600 hover:bg-white hover:shadow-sm'
                                }`}
                        >
                            <span className="mr-3 text-lg">{m.icon}</span>
                            {m.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-3/4 p-6 md:p-10 overflow-y-auto bg-white">

                {/* MODUL 1 */}
                {activeModule === 1 && (
                    <div className="space-y-8 animate-fadeIn">
                        <header className="border-b pb-4">
                            <h2 className="text-3xl font-bold text-teal-900">Modül 1: Tütün Kontrolü Vizyonu</h2>
                            <p className="text-lg text-slate-500 mt-2">Neden bu işi yapıyoruz? Ulusal strateji ve endüstri taktikleri.</p>
                        </header>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-bold text-blue-900 text-lg mb-2">📌 Temel Vizyon</h3>
                            <p className="text-blue-800">
                                Amaç sadece sigarayı bıraktırmak değil; tütün endüstrisinin yeni ürünleri olan <strong>elektronik sigara, ısıtılmış tütün ürünleri ve nargile</strong> gibi tehditlerden toplumu topyekün korumaktır.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                                    <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs mr-2">DSÖ</span>
                                    MPOWER Stratejisi
                                </h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start"><span className="font-bold mr-2 w-4">M</span> <span><strong>Monitor:</strong> Tütün kullanımını izle.</span></li>
                                    <li className="flex items-start"><span className="font-bold mr-2 w-4">P</span> <span><strong>Protect:</strong> Pasif etkilenimden koru.</span></li>
                                    <li className="flex items-start"><span className="font-bold mr-2 w-4">O</span> <span><strong>Offer:</strong> Bırakmak isteyene yardım et.</span></li>
                                    <li className="flex items-start"><span className="font-bold mr-2 w-4">W</span> <span><strong>Warn:</strong> Zararları konusunda uyar.</span></li>
                                    <li className="flex items-start"><span className="font-bold mr-2 w-4">E</span> <span><strong>Enforce:</strong> Reklam ve sponsorluğu yasakla.</span></li>
                                    <li className="flex items-start"><span className="font-bold mr-2 w-4">R</span> <span><strong>Raise:</strong> Vergileri artır.</span></li>
                                </ul>
                            </div>
                            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                <h3 className="font-bold text-red-900 mb-4">⚠️ Endüstri Taktikleri</h3>
                                <p className="text-sm text-red-800 mb-4">
                                    Tütün endüstrisi, özellikle <strong>gençleri ve kadınları</strong> hedef alır.
                                </p>
                                <ul className="list-disc pl-5 text-sm text-red-800 space-y-2">
                                    <li>"Elektronik sigara zararsızdır" yalanı.</li>
                                    <li>"Light", "Düşük Katran" gibi kandırmacalar.</li>
                                    <li>İnkar, Kandırma, Geciktirme stratejileri.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODUL 2 */}
                {activeModule === 2 && (
                    <div className="space-y-8 animate-fadeIn">
                        <header className="border-b pb-4">
                            <h2 className="text-3xl font-bold text-teal-900">Modül 2: Fizyoloji & Değerlendirme</h2>
                            <p className="text-lg text-slate-500 mt-2">Hastayı tıbbi ve psikolojik olarak tanıma (Triyaj).</p>
                        </header>

                        <div className="bg-purple-50 p-6 rounded-xl flex items-start gap-4">
                            <div className="text-4xl">🧠</div>
                            <div>
                                <h3 className="font-bold text-purple-900">Bağımlılık Döngüsü</h3>
                                <p className="text-purple-800 text-sm mt-1">
                                    Nikotin, beyindeki dopaminerjik sistem üzerinden güçlü bir fiziksel ve ruhsal bağımlılık yapar. Sigara içildikten 7 saniye sonra nikotin beyne ulaşır ve "ödül" merkezini uyarır.
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="border p-5 rounded-xl">
                                <h4 className="font-bold text-slate-700 mb-2">Ölçüm Araçları</h4>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="bg-gray-50 p-2 rounded">
                                        <strong>Fagerström Testi:</strong> Bağımlılık şiddetini ölçer. En kritik soru: <em>"İlk sigaranızı uyandıktan ne kadar sonra içiyorsunuz?"</em>
                                    </li>
                                    <li className="bg-gray-50 p-2 rounded">
                                        <strong>CO (Karbonmonoksit) Ölçümü:</strong> Beyanı doğrular ve motivasyon sağlar.
                                        <div className="mt-1 text-xs text-gray-500 flex gap-2">
                                            <span className="text-green-600">0-6 ppm: İçmiyor</span>
                                            <span className="text-amber-600">7-10 ppm: Belirsiz</span> <span className="text-red-600">&gt;10 ppm: İçici</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="border p-5 rounded-xl">
                                <h4 className="font-bold text-slate-700 mb-2">Değişim Evreleri (Transtheoretik)</h4>
                                <div className="space-y-2 relative">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                                    {[
                                        { l: 'Farkındalık Öncesi', d: 'İstemiyor / İnkar' },
                                        { l: 'Farkındalık', d: 'Düşünüyor ama kararsız' },
                                        { l: 'Hazırlık', d: '1 ay içinde bırakacak' },
                                        { l: 'Eylem', d: 'Bıraktı (< 6 ay)' },
                                        { l: 'İdame', d: 'Bıraktı (> 6 ay)' }
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center relative z-10">
                                            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold mr-3 border-2 border-white shadow-sm">{i + 1}</div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-700">{s.l}</span>
                                                <span className="text-xs text-slate-500 ml-2">({s.d})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODUL 3 */}
                {activeModule === 3 && (
                    <div className="space-y-8 animate-fadeIn">
                        <header className="border-b pb-4">
                            <h2 className="text-3xl font-bold text-teal-900">Modül 3: Temel Müdahale (5A & 5R)</h2>
                            <p className="text-lg text-slate-500 mt-2">Hastanın hazır oluşuna göre algoritma seçimi.</p>
                        </header>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* 5A */}
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <h3 className="font-bold text-green-900 text-xl mb-4 flex items-center">
                                    <span className="bg-green-200 p-1 rounded mr-2">👍</span> İstekli Hasta (5A)
                                </h3>
                                <ul className="space-y-3">
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>1. Ask (Sor):</strong> Her görüşmede sor.</li>
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>2. Advise (Öner):</strong> Net ve güçlü öner.</li>
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>3. Assess (Ölç):</strong> Hazır mı?</li>
                                    <li className="bg-white p-3 rounded shadow-sm border-l-4 border-teal-500">
                                        <strong>4. Assist (Yardım Et):</strong> Tedavi planı.
                                        <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                                            <strong>STAR Yöntemi:</strong>
                                            <br />• <strong>S</strong>et: Bırakma günü belirle.
                                            <br />• <strong>T</strong>ell: Çevrene söyle.
                                            <br />• <strong>A</strong>nticipate: Zorlukları öngör.
                                            <br />• <strong>R</strong>emove: Tütünü uzaklaştır.
                                        </div>
                                    </li>
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>5. Arrange (İzle):</strong> Takip et.</li>
                                </ul>
                            </div>

                            {/* 5R */}
                            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                <h3 className="font-bold text-red-900 text-xl mb-4 flex items-center">
                                    <span className="bg-red-200 p-1 rounded mr-2">👎</span> İsteksiz Hasta (5R)
                                </h3>
                                <ul className="space-y-3">
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>1. Relevance (İlişki):</strong> Kişisel nedenleri bul.</li>
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>2. Risks (Riskler):</strong> Zararları konuş.</li>
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>3. Rewards (Ödüller):</strong> Kazançları vurgula.</li>
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>4. Roadblocks (Engeller):</strong> Korkuları (kilo, stres) çalış.</li>
                                    <li className="bg-white p-3 rounded shadow-sm"><strong>5. Repetition (Tekrar):</strong> Her gelişte tekrarla.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODUL 4 */}
                {activeModule === 4 && (
                    <div className="space-y-8 animate-fadeIn">
                        <header className="border-b pb-4">
                            <h2 className="text-3xl font-bold text-teal-900">Modül 4: Motivasyonel Görüşme</h2>
                            <p className="text-lg text-slate-500 mt-2">Dirençli vakalarda iletişim dili.</p>
                        </header>

                        <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
                            <h3 className="font-bold text-yellow-900">Temel Ruh</h3>
                            <p className="text-yellow-800 mt-1 italic">
                                "Seni değiştireceğim" değil, "Değişmene yardım edebilirim". Danışanın içindeki değişim isteğini ortaya çıkarmak esastır.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 text-xl">OARS Tekniği</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                                    <div className="text-teal-600 font-bold mb-1">O - Open Ended Questions</div>
                                    <div className="text-sm text-slate-600">
                                        "Neden içiyorsun?" (Yargılayıcı) yerine <strong>"Sigaranın size ne gibi bir faydası olduğunu düşünüyorsunuz?"</strong> (Meraklı).
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                                    <div className="text-teal-600 font-bold mb-1">A - Affirmation (Onaylama)</div>
                                    <div className="text-sm text-slate-600">
                                        Danışanın güçlü yanlarını takdir et. "Bugün buraya gelmeniz bile büyük bir adım."
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                                    <div className="text-teal-600 font-bold mb-1">R - Reflection (Yansıtma)</div>
                                    <div className="text-sm text-slate-600">
                                        Duyguyu aynala. "Bırakmak istiyorsunuz ama kilo almaktan çok korkuyorsunuz."
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg hover:shadow-md transition-all">
                                    <div className="text-teal-600 font-bold mb-1">S - Summarizing (Özetleme)</div>
                                    <div className="text-sm text-slate-600">
                                        Konuşulanları toparla ve "Doğru anlamış mıyım?" diye sor.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-600">
                            <strong>Dirençle Dans (Rolling with Resistance):</strong> Dirençle karşılaşıldığında tartışmaya girmeyin. Judo yapar gibi, direncin gücünü kullanarak yönlendirin.
                        </div>
                    </div>
                )}

                {/* MODUL 5 */}
                {activeModule === 5 && (
                    <div className="space-y-8 animate-fadeIn">
                        <header className="border-b pb-4">
                            <h2 className="text-3xl font-bold text-teal-900">Modül 5: BDT & Baş Etme</h2>
                            <p className="text-lg text-slate-500 mt-2">Otomatik pilottan çıkış stratejileri.</p>
                        </header>

                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                            <h3 className="font-bold text-indigo-900 mb-2">Duygu-Düşünce-Davranış Modeli</h3>
                            <p className="text-indigo-800 text-sm">
                                <strong>Duygu → Düşünce → Davranış</strong> zincirini kırmak. Sigara içme davranışını tetikleyen duyguyu ve otomatik düşünceyi ("Sigara beni rahatlatır") fark edip çürütmek.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold text-red-600 mb-4 flex items-center text-xl">
                                <span className="mr-2">🚨</span> 4D Kuralı (Acil Durum Planı)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white border-2 border-red-100 p-4 rounded-xl text-center hover:border-red-400 transition-all shadow-sm">
                                    <div className="text-2xl mb-2">⏱️</div>
                                    <div className="font-bold text-slate-800">1. DELAY</div>
                                    <div className="text-xs text-slate-500 mt-1">Ertele. İstek 3-5 dakikada geçer.</div>
                                </div>
                                <div className="bg-white border-2 border-red-100 p-4 rounded-xl text-center hover:border-red-400 transition-all shadow-sm">
                                    <div className="text-2xl mb-2">🫁</div>
                                    <div className="font-bold text-slate-800">2. DEEP BREATH</div>
                                    <div className="text-xs text-slate-500 mt-1">Derin nefes alıp ver.</div>
                                </div>
                                <div className="bg-white border-2 border-red-100 p-4 rounded-xl text-center hover:border-red-400 transition-all shadow-sm">
                                    <div className="text-2xl mb-2">💧</div>
                                    <div className="font-bold text-slate-800">3. DRINK WATER</div>
                                    <div className="text-xs text-slate-500 mt-1">Yudum yudum su iç.</div>
                                </div>
                                <div className="bg-white border-2 border-red-100 p-4 rounded-xl text-center hover:border-red-400 transition-all shadow-sm">
                                    <div className="text-2xl mb-2">🧩</div>
                                    <div className="font-bold text-slate-800">4. DISTRACT</div>
                                    <div className="text-xs text-slate-500 mt-1">Dikkatini başka yöne çevir.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODUL 6 */}
                {activeModule === 6 && (
                    <div className="space-y-8 animate-fadeIn">
                        <header className="border-b pb-4">
                            <h2 className="text-3xl font-bold text-teal-900">Modül 6: Farmakolojik Tedavi</h2>
                            <p className="text-lg text-slate-500 mt-2">Hekim kontrolünde uygulanacak protokoller.</p>
                        </header>

                        <div className="grid gap-6">
                            {PHARMACOLOGICAL_TREATMENTS.map((drug, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                                    <div className="bg-slate-50 p-4 border-b border-gray-200 flex justify-between items-center">
                                        <h4 className="font-bold text-lg text-slate-800">{drug.name}</h4>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">{drug.commercialName}</span>
                                    </div>
                                    <div className="p-5 text-sm space-y-3">
                                        <p><strong className="text-slate-700">Dozaj:</strong> {drug.dosage}</p>
                                        <p><strong className="text-slate-700">Süre:</strong> {drug.duration}</p>
                                        <div>
                                            <strong className="text-red-600 block mb-1">Kontrendikasyonlar:</strong>
                                            <ul className="list-disc pl-5 text-slate-600">
                                                {drug.contraindications.map((ci, i) => <li key={i}>{ci}</li>)}
                                            </ul>
                                        </div>
                                        <div className="bg-yellow-50 p-3 rounded text-yellow-900 mt-2 text-xs">
                                            <strong>Not:</strong> {drug.notes}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4 text-sm">
                            <strong>Ek Bilgi:</strong>
                            <ul className="list-disc pl-5 mt-1 text-green-900">
                                <li><strong>Kombine NRT:</strong> Bant (uzun etkili) ve Sakız/Pastil (kısa etkili) birlikte kullanımı, tekli kullanımdan daha etkilidir.</li>
                                <li><strong>Sitizin:</strong> Varenikline benzer etki mekanizmasına sahip bitkisel kökenli, düşük maliyetli bir seçenektir.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* MODUL 7 */}
                {activeModule === 7 && (
                    <div className="space-y-8 animate-fadeIn">
                        <header className="border-b pb-4">
                            <h2 className="text-3xl font-bold text-teal-900">Modül 7: Özel Gruplar</h2>
                            <p className="text-lg text-slate-500 mt-2">Riskli senaryolar ve dikkat edilmesi gerekenler.</p>
                        </header>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                                <h3 className="font-bold text-pink-900 text-lg mb-3">🤰 Gebeler</h3>
                                <p className="text-sm text-pink-800 mb-2">
                                    İlaç (Bupropion/Vareniklin) <strong>önerilmez.</strong> Öncelik psikososyal destektir.
                                </p>
                                <p className="text-sm text-pink-800">
                                    Zorunlu hallerde NRT, özellikle sakız veya pastil gibi kısa etkili formlarla, hekimin fayda-zarar değerlendirmesi sonrasında düşünülebilir.
                                </p>
                            </div>

                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                <h3 className="font-bold text-orange-900 text-lg mb-3">🧑‍🎓 Ergenler (&lt;18)</h3>
                                <p className="text-sm text-orange-800 mb-2">
                                    İlaç kullanımı için yeterli kanıt yoktur, rutin önerilmez.
                                </p>
                                <p className="text-sm text-orange-800">
                                    Odak noktası motivasyonel görüşme ve <strong>akran baskısıyla baş etme</strong> (Hayır deme becerisi) olmalıdır.
                                </p>
                            </div>

                            <div className="bg-red-50 p-6 rounded-xl border border-red-100 md:col-span-2">
                                <h3 className="font-bold text-red-900 text-lg mb-3">❤️ Kalp Hastaları</h3>
                                <p className="text-sm text-red-800">
                                    Akut koroner sendrom (kriz) sonrası <strong>ilk 2 hafta</strong> NRT önerilmez. Stabil hastalarda güvenlidir. Vareniklin kardiyovasküler hastalarda hekim değerlendirmesiyle kullanılabilir.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODUL 8 */}
                {activeModule === 8 && (
                    <div className="space-y-8 animate-fadeIn">
                        <header className="border-b pb-4">
                            <h2 className="text-3xl font-bold text-teal-900">Modül 8: İzlem & Relaps Yönetimi</h2>
                            <p className="text-lg text-slate-500 mt-2">Tedavinin sürekliliği ve nüksü önleme.</p>
                        </header>

                        <div className="flex flex-col md:flex-row gap-6 items-center bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg mb-2">Kayma (Slip) vs. Nüks (Relaps)</h3>
                                <p className="text-sm text-slate-600 mb-4">Bu fark hastaya mutlaka anlatılmalıdır.</p>
                                <div className="space-y-2">
                                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded">
                                        <strong>⚠️ Kayma (Slip):</strong> "Bir tane içtim." Bir başarısızlık değil, öğrenme fırsatıdır. Hemen yola devam edilir.
                                    </div>
                                    <div className="bg-red-100 text-red-800 p-3 rounded">
                                        <strong>🚨 Nüks (Relaps):</strong> "Eskisi gibi içiyorum." Tedavi stratejisi değiştirilmeli, doz artırılmalı veya kombinasyon denenmelidir.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-l-4 border-teal-500 pl-6 py-2">
                            <h3 className="font-bold text-teal-900 text-lg mb-2">Takip Takvimi</h3>
                            <ul className="text-sm text-slate-700 space-y-2">
                                <li>📅 <strong>İlk 15 gün:</strong> En az bir görüşme (En riskli dönem).</li>
                                <li>📅 <strong>İlk 3 ay:</strong> Ayda bir görüşme.</li>
                                <li>📅 <strong>Sonraki dönem:</strong> 3 ayda bir takip.</li>
                            </ul>
                        </div>

                        <div className="bg-slate-100 p-6 rounded-xl">
                            <h3 className="font-bold text-slate-800 mb-2">Nüks Nedenleri Analizi</h3>
                            <p className="text-sm text-slate-600">
                                Hasta tekrar başladığında yargılanmamalıdır. Neden (Stres? Kilo? Sosyal baskı?) analiz edilip yeni bir baş etme planı (BDT Modülü) oluşturulmalıdır.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
