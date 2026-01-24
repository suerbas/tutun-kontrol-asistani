

import { DrugInfo, COMORBIDITIES, SpecialProfile } from './types';

// --- MOTİVASYON KATEGORİLERİ (YENİ) ---
export const MOTIVATION_CATEGORIES = [
    { 
        id: 'health', 
        label: 'Kişisel Sağlık', 
        icon: '❤️', 
        description: 'Mevcut hastalıklar veya gelecek endişesi.',
        examples: ['Nefes Darlığı / KOAH', 'Kanser Korkusu', 'Kalp Krizi Riski', 'Daha Zinde Hissetmek', 'Öksürükten Kurtulmak'] 
    },
    { 
        id: 'family', 
        label: 'Aile ve Sevdiklerim', 
        icon: '👨‍👩‍👧‍👦', 
        description: 'Başkaları için veya örnek olma isteği.',
        examples: ['Çocuklarım İçin', 'Torunum İçin', 'Eşimin İsteği', 'Pasif İçicilikten Koruma', 'İyi Örnek Olmak'] 
    },
    { 
        id: 'money', 
        label: 'Maddiyat / Ekonomi', 
        icon: '💰', 
        description: 'Sigara maliyeti ve birikim hedefleri.',
        examples: ['Sigara Çok Pahalı', 'Para Biriktirmek', 'Borçları Ödemek', 'Tatile Gitmek', 'Ekonomik Özgürlük'] 
    },
    { 
        id: 'aesthetic', 
        label: 'Görünüm ve Koku', 
        icon: '✨', 
        description: 'Kişisel bakım ve estetik kaygılar.',
        examples: ['Kötü Koku', 'Diş Sararması', 'Cilt Yaşlanması', 'Daha Genç Görünmek', 'Kıyafetlerin Kokması'] 
    },
    { 
        id: 'freedom', 
        label: 'Özgürlük ve İrade', 
        icon: '🕊️', 
        description: 'Bağımlılıktan kurtulma arzusu.',
        examples: ['Bağımlı Olmaktan Yoruldum', 'Kendime Kanıtlamak', 'Dini/Manevi Sebepler', 'İrademi Güçlendirmek'] 
    },
    { 
        id: 'pregnancy', 
        label: 'Gebelik / Bebek', 
        icon: '🤰', 
        description: 'Anne ve bebek sağlığı.',
        examples: ['Bebeğimin Sağlığı', 'Sağlıklı Doğum', 'Emzirme Süreci', 'Hamilelik Planı'] 
    },
    { 
        id: 'forced', 
        label: 'Zorunluluk / Dış Baskı', 
        icon: '⚠️', 
        description: 'Kişisel istek yok. Doktor, aile veya koşullar zorluyor.',
        examples: ['Doktorum Zorladı', 'Ailem İstiyor', 'Ameliyat İçin Mecburum', 'İş Yeri Kuralı'] 
    }
];

// --- MEVCUT SABİTLER (FAGERSTROM vb.) KORUNUYOR ---
export const FAGERSTROM_QUESTIONS = [
    {
        id: 1,
        question: "Günün ilk sigarasını uyandıktan ne kadar sonra içiyorsunuz?",
        options: [
            { text: "İlk 5 dakika içinde", points: 3 },
            { text: "6-30 dakika içinde", points: 2 },
            { text: "31-60 dakika içinde", points: 1 },
            { text: "1 saatten sonra", points: 0 }
        ]
    },
    {
        id: 2,
        question: "Sigara içilmesi yasak olan yerlerde (örneğin; hastane, sinema gibi) sigara içmemekte zorlanıyor musunuz?",
        options: [
            { text: "Evet", points: 1 },
            { text: "Hayır", points: 0 }
        ]
    },
    {
        id: 3,
        question: "Hangi sigaradan vazgeçmekte en çok zorlanırsınız?",
        options: [
            { text: "Sabah ilk içilen sigara", points: 1 },
            { text: "Diğer herhangi biri", points: 0 }
        ]
    },
    {
        id: 4,
        question: "Günde kaç adet sigara içiyorsunuz?",
        options: [
            { text: "31 ve daha fazla", points: 3 },
            { text: "21-30 adet", points: 2 },
            { text: "11-20 adet", points: 1 },
            { text: "10 ve daha az", points: 0 }
        ]
    },
    {
        id: 5,
        question: "Günün ilk saatlerinde, daha sonraki saatlere göre daha sık sigara içiyor musunuz?",
        options: [
            { text: "Evet", points: 1 },
            { text: "Hayır", points: 0 }
        ]
    },
    {
        id: 6,
        question: "Günün çoğunu yatakta geçirecek kadar hasta olduğunuzda da sigara içer misiniz?",
        options: [
            { text: "Evet", points: 1 },
            { text: "Hayır", points: 0 }
        ]
    }
];

export const PHARMACOLOGICAL_TREATMENTS: DrugInfo[] = [
    {
        name: "Nikotin Replasman Tedavisi (NRT) - Bant",
        commercialName: "Nicorette Bant",
        dosage: "Günde >20 sigara içenlerde: 21mg/24saat. Günde <20 sigara içenlerde: 14mg/24saat ile başlanır.",
        titration: "4 hafta tam doz (21mg veya 14mg), sonra 2 hafta orta doz (14mg), sonra 2 hafta düşük doz (7mg). Toplam 8-12 hafta.",
        duration: "8-12 hafta",
        contraindications: ["Akut miyokard enfarktüsü (son 1 ay)", "Ciddi aritmiler", "Stabil olmayan anjina", "Yaygın Cilt Hastalığı"],
        sideEffects: [
            {
                effect: "Ciltte Kızarıklık / Kaşıntı (Lokal Reaksiyon)",
                management: "Uygulama yerini her gün değiştirin. Aynı bölgeye 1 hafta boyunca tekrar yapıştırmayın. Gerekirse %1 hidrokortizon krem önerilebilir. Şikayet şiddetliyse bant markasını değiştirmeyi veya oral formlara (sakız/pastil) geçmeyi değerlendirin."
            },
            {
                effect: "Uykusuzluk (İnsomnia) / Canlı Rüyalar",
                management: "Bant 24 saatlik formdaysa, gece yatmadan önce (veya 16 saatlik kullanımdan sonra) çıkartılmasını önerin. Sabah uyanınca yenisini taksın. Rüyalar devam ederse dozajı düşürmeyi değerlendirin."
            },
            {
                effect: "Baş ağrısı",
                management: "Genellikle tedavinin ilk haftalarında görülür ve tolerans gelişir. Basit analjezikler (Parasetamol) önerin. Şiddetliyse dozajın hastaya yüksek gelip gelmediğini kontrol edin, gerekirse bir alt doza (14mg) geçin."
            }
        ],
        notes: "Sabah uyanınca tüysüz ve temiz bir deri bölgesine (kol üstü, göğüs) yapıştırılır. Banyo yaparken çıkabilir, yenisi takılmalıdır."
    },
    {
        name: "Nikotin Replasman Tedavisi (NRT) - Sakız",
        commercialName: "Nicorette Sakız",
        dosage: "Yüksek bağımlılıkta (ilk sigara <30dk): 4mg. Düşük bağımlılıkta: 2mg. Saatte 1-2 adet çiğne-park et tekniği ile.",
        titration: "İlk 6 hafta: 1-2 saatte bir (en az 9 adet/gün). 7-9. hafta: 2-4 saatte bir. 10-12. hafta: 4-8 saatte bir. Günde 24 adedi geçmeyin.",
        duration: "12 haftaya kadar (Gerekirse 6 ay)",
        contraindications: ["Diş problemleri", "Temporomandibular eklem hastalığı", "Gebelik (Nispi)"],
        sideEffects: [
            {
                effect: "Ağız / Boğaz Tahrişi ve Yanma",
                management: "'Çiğne-Park Et' tekniğinin yanlış uygulandığını gösterir. Hastaya sakızı sürekli çiğnememesini, biber tadı alınca yanağında bekletmesini (park etmesini) tekrar uygulamalı anlatın."
            },
            {
                effect: "Hıçkırık / Mide Bulantısı / Hazımsızlık",
                management: "Nikotinin yutulmasından kaynaklanır. Sakızın çok hızlı çiğnendiğini gösterir. Daha yavaş çiğnemesini ve tükürüğü yutmadan önce bir süre ağızda tutmasını söyleyin. Sakız kullanımı sırasında asitli içeceklerden kaçınılmalıdır."
            },
            {
                effect: "Çene Ağrısı",
                management: "Çiğneme sıklığını azaltın. Hastanın diş/protez sorunu varsa sakız tedavisini kesin, bant formuna geçiş yapın."
            }
        ],
        notes: "Asitli içeceklerle (kola, kahve, meyve suyu) birlikte alınmamalıdır (emilimi bozar). Yemekten 15 dk sonra kullanılmalıdır."
    },
    {
        name: "Bupropion HCl",
        commercialName: "Zyban, Wellbutrin",
        dosage: "150mg tablet. Sigara bırakma gününden 1-2 hafta önce başlanır.",
        titration: "İlk 3 gün: Günde 1x150mg (Sabah). 4. günden itibaren: Günde 2x150mg (En az 8 saat ara ile).\n\n⚠️ **Özel Gruplar:** Yaşlı hastalarda, böbrek veya karaciğer yetmezliği olanlarda doz artırımı yapılmaz, tedaviye günde tek doz (150mg) ile devam edilir.",
        duration: "7-12 hafta. Nüks riski yüksek hastalarda tedavi 6 aya kadar uzatılabilir.",
        contraindications: [COMORBIDITIES.EPILEPSY, "Yeme bozukluğu (Anoreksiya/Blumia)", "MAO inhibitörü kullanımı", "Ağır kafa travması öyküsü"],
        sideEffects: [
            {
                effect: "Uykusuzluk (İnsomnia)",
                management: "İkinci dozu yatma saatine yakın almamalıdır. Akşam dozunu en geç 17:00-18:00 civarında almasını sağlayın. Şikayet devam ederse günde tek doza (1x150mg) düşülerek tedaviye devam edilebilir."
            },
            {
                effect: "Ağız Kuruluğu",
                management: "Sık görülen bir yan etkidir. Bol su içmesini, şekersiz sakız çiğnemesini veya buz emmesini önerin. Genellikle zamanla azalır."
            },
            {
                effect: "Hipertansiyon (Tansiyon Yükselmesi)",
                management: "Tedavi öncesi ve sırasında düzenli tansiyon takibi yapın. Kontrolsüz hipertansiyon gelişirse ilacı kesin veya antihipertansif tedavisini gözden geçirin."
            },
            {
                effect: "Anksiyete / Sinirlilik",
                management: "Hastanın psikiyatrik öyküsünü sorgulayın. Semptomlar tolere edilemez düzeydeyse ilacı kesin ve NRT'ye geçiş yapın."
            }
        ],
        notes: "Kilo alımını geciktirici etkisi vardır. Depresyon öyküsü olan hastalarda iyi bir seçenektir."
    },
    {
        name: "Vareniklin",
        commercialName: "Champix",
        dosage: "0.5mg ve 1mg tabletler. Sigara bırakma gününden 1-2 hafta önce başlanır.",
        titration: "1-3. gün: 0.5mg x 1. \n4-7. gün: 0.5mg x 2. \n8. gün - Tedavi sonu: 1mg x 2.\n\n⚠️ **Özel Gruplar:** Ciddi böbrek yetmezliğinde (Kreatinin klerensi <30ml/dk) doz günde tek sefer 0.5mg olarak başlanmalı, tolere edilebilirse maksimum günde 2 kez 0.5mg'a çıkılmalıdır. Yaşlılarda böbrek fonksiyonu normalse doz ayarı gerekmez.",
        duration: "12 hafta. Başarılı olgularda nüksü önlemek için tedavi 12 hafta daha uzatılarak toplam 24 haftaya tamamlanabilir.",
        contraindications: ["Ciddi böbrek yetmezliği (doz ayarı gerekir)", "18 yaş altı", "Gebelik"],
        sideEffects: [
            {
                effect: "Mide Bulantısı (En sık)",
                management: "İlacı mutlaka TOK KARNA ve BİR BARDAK SU ile almasını söyleyin. Şikayet devam ederse dozu geçici olarak azaltın (0.5mg x 2 ile devam edilebilir)."
            },
            {
                effect: "Uykusuzluk ve Anormal Rüyalar",
                management: "Akşam dozunu yatmadan hemen önce değil, akşam yemeği ile birlikte almasını önerin. Rahatsız edici boyuttaysa akşam dozunu kesin veya azaltın."
            },
            {
                effect: "Nöropsikiyatrik Semptomlar (Depresif ruh hali, Ajitasyon)",
                management: "Hastayı ve yakınlarını uyarın. Davranış değişikliği, ajitasyon veya intihar düşüncesi gelişirse ilacı DERHAL KESİN ve psikiyatrik değerlendirme isteyin."
            }
        ],
        notes: "Parsiyel agonisttir; hem yoksunluğu giderir hem de sigaradan alınan hazzı bloke eder. Nöropsikiyatrik değişimler açısından izlenmelidir."
    },
    {
        name: "Sitizin (Cytisine)",
        commercialName: "Nikitabs / Tabex",
        dosage: "1.5mg tablet. 25 günlük sıkıştırılmış kür.",
        titration: "1-3. gün: 2 saatte bir (6 tb/gün). \n4-12. gün: 2.5 saatte bir (5 tb). \n13-16. gün: 4 tb. \n17-20. gün: 3 tb. \n21-25. gün: 1-2 tb.",
        duration: "25 gün",
        contraindications: ["Stabil olmayan anjina", "Yakın zamanda MI", "Gebelik/Emzirme", "Şiddetli hipertansiyon"],
        sideEffects: [
            {
                effect: "Gastrointestinal Rahatsızlıklar (Mide ağrısı, bulantı)",
                management: "Dozların tok karna alınmasını sağlayın. Bol su tüketimi önerin. Şikayetler devam ederse kullanım sıklığını azaltın."
            },
            {
                effect: "Baş Dönmesi / Halsizlik",
                management: "Tansiyon takibi yapın. Araç veya makine kullanırken dikkatli olmasını söyleyin."
            },
            {
                effect: "Nikotin Zehirlenmesi Riski",
                management: "5. günden sonra hasta hala sigara içiyorsa ilacı kesmesini söyleyin (İlaç + Sigara nikotin toksisitesi yapabilir). Birkaç ay sonra tekrar denenebilir."
            }
        ],
        notes: "Varenikline benzer etki mekanizması vardır. Kısa süreli ve uygun maliyetli bir seçenektir."
    }
];

export const FIVE_A_MODEL = [
    { step: "Ask (Sor)", desc: "Her görüşmede tütün kullanımını sorgula ve kaydet." },
    { step: "Advise (Öner)", desc: "Açık, güçlü ve kişiye özel bir dille bırakmayı öner." },
    { step: "Assess (Değerlendir)", desc: "Bırakma isteğini ve bağımlılık düzeyini ölç." },
    { step: "Assist (Yardım Et)", desc: "Bırakma planı yap, ilaç öner, destek sağla." },
    { step: "Arrange (İzle)", desc: "Takip randevularını planla (ilk hafta, 1. ay)." }
];

export const FIVE_R_MODEL = [
    { step: "Relevance (İlişkilendir)", desc: "Bırakmanın kişi için neden önemli olduğunu bul." },
    { step: "Risks (Riskler)", desc: "Kişinin sağlığına olumsuz etkilerini konuş." },
    { step: "Rewards (Ödüller)", desc: "Bırakmanın kazandıracağı faydaları vurgula (sağlık, ekonomik)." },
    { step: "Roadblocks (Engeller)", desc: "Bırakmayı engelleyen faktörleri belirle ve çözüm üret." },
    { step: "Repetition (Tekrar)", desc: "Her görüşmede motivasyonu tekrarla." }
];

export const FIVE_R_DETAILS = [
    {
        id: 'relevance',
        title: '1. RELEVANCE (İlişkilendirme)',
        goal: 'Hastanın sigarayı bırakmayı neden kişisel olarak önemsemesi gerektiğini bulmasını sağlayın.',
        question: 'Sigaranın şu anki hayatınıza, sağlığınıza veya ailenize nasıl bir etkisi olduğunu düşünüyorsunuz?',
        items: [
            { id: 'rel_1', text: 'Mevcut Hastalığı (Öksürük, Nefes Darlığı, Kalp)' },
            { id: 'rel_2', text: 'Çocukları / Torunları (Pasif İçicilik, Örnek Olma)' },
            { id: 'rel_3', text: 'Maddi Durum / Ekonomi' },
            { id: 'rel_4', text: 'Fiziksel Performans / Merdiven Çıkma' },
            { id: 'rel_5', text: 'Cilt Yaşlanması / Estetik Kaygılar' }
        ]
    },
    {
        id: 'risks',
        title: '2. RISKS (Riskler)',
        goal: 'Sigaranın akut ve uzun vadeli zararlarını kişiselleştirerek anlatın.',
        question: 'Sigara içmeye devam ederseniz başınıza gelebilecek en kötü şeyin ne olduğunu düşünüyorsunuz?',
        items: [
            { id: 'risk_1', text: 'Akut Riskler: Nefes darlığı, öksürük nöbetleri, astım alevlenmesi, artmış solunum yolu enfeksiyonları, impotans (iktidarsızlık), kısırlık ve gebelik komplikasyonları.' },
            { id: 'risk_2', text: 'Uzun Vadeli Riskler: Kalp Krizi, İnme (Felç), Akciğer Kanseri ve diğer kanserler (Gırtlak, Ağız boşluğu, Mesane, Pankreas), KOAH (Kronik Obstrüktif Akciğer Hastalığı), Osteoporoz.' },
            { id: 'risk_3', text: 'Çevresel Riskler: Eşte artmış akciğer kanseri ve kalp hastalığı riski; Çocuklarda düşük doğum ağırlığı, Ani Bebek Ölümü Sendromu (SIDS), astım, orta kulak iltihabı ve solunum yolu enfeksiyonları.' }
        ]
    },
    {
        id: 'rewards',
        title: '3. REWARDS (Ödüller)',
        goal: 'Bırakmanın olumlu yanlarını vurgulayın (Sadece sağlık değil).',
        question: 'Sigarayı bıraktığınızda hayatınızda nelerin daha iyi olacağını hayal ediyorsunuz?',
        items: [
            { id: 'rew_1', text: 'Tat ve koku alma duyusunun geri gelmesi' },
            { id: 'rew_2', text: 'Para biriktirme (Günde 1 paket = Ayda ciddi tasarruf)' },
            { id: 'rew_3', text: 'Daha rahat nefes alma, merdiven çıkabilme' },
            { id: 'rew_4', text: 'Evde/Arabada/Kıyafette kötü kokunun bitmesi' },
            { id: 'rew_5', text: 'Çocuklarıma iyi örnek olma' },
            { id: 'rew_6', text: 'Cildin daha canlı görünmesi, diş lekelerinin azalması' }
        ]
    },
    {
        id: 'roadblocks',
        title: '4. ROADBLOCKS (Engeller)',
        goal: 'Hastanın bırakmaktan korkma nedenlerini belirleyin ve çözüm üretin.',
        question: 'Sigarayı bırakmanızı engelleyen en büyük korkunuz veya endişeniz nedir?',
        items: [
            { id: 'rb_1', text: 'Yoksunluk Belirtileri (Sinirlilik, İstek)', solution: 'İlaç tedavisi (NRT/Champix) bu belirtileri %70-80 oranında azaltır.' },
            { id: 'rb_2', text: 'Kilo Alma Korkusu', solution: 'Bırakınca metabolizma biraz yavaşlar ama sağlıklı atıştırmalıklar ve yürüyüşle bu kontrol edilebilir. Sigaranın zararı 50 kilo almaya eşdeğerdir.' },
            { id: 'rb_3', text: 'Stresle Baş Edememe', solution: 'Sigara stresi azaltmaz, sadece nikotin eksikliğini giderir. Nefes egzersizleri ve yürüyüş gerçek stresi azaltır.' },
            { id: 'rb_4', text: 'Sosyal Çevre (Arkadaşlarım içiyor)', solution: 'İlk haftalarda sigara içilen ortamlardan uzak durun. Onlara bıraktığınızı söyleyin ve destek isteyin.' },
            { id: 'rb_5', text: 'Başarısızlık Korkusu (Daha önce denedim)', solution: 'Her deneme bir tecrübedir. Çoğu kişi 3-4 denemeden sonra kalıcı bırakır. Bu sefer farklı bir yöntem (ilaç+destek) deneyeceğiz.' }
        ]
    },
    {
        id: 'repetition',
        title: '5. REPETITION (Tekrar)',
        goal: 'Motivasyonu canlı tutun ve kapıyı açık bırakın.',
        question: 'Bugün hazır hissetmiyor olabilirsiniz, ancak ben size destek olmak için buradayım.',
        items: [
            { id: 'rep_1', text: 'Broşür/Materyal verildi.' },
            { id: 'rep_2', text: 'Bir sonraki poliklinik randevusunda konu tekrar açılacak.' },
            { id: 'rep_3', text: 'Hasta "Düşüneceğim" dedi, olumlu ayrıldı.' }
        ]
    },
];

export const BEHAVIORAL_GUIDE = [
    {
        id: 'stress',
        trigger: 'Stres / Sinirlilik Anında',
        strategy: '4-7-8 Nefes Egzersizi: 4 saniye burundan derin nefes al, 7 saniye tut, 8 saniye ağızdan yavaşça üfle. Bunu 3 kez tekrarla.',
        dialogue: 'Stresli anlarda sigaranın sizi sakinleştirdiğini düşünüyorsunuz ama aslında o an sadece nikotin açlığınızı gideriyorsunuz. Bir dahaki sefere sigara yakmak yerine 3 dakika boyunca balkona çıkıp derin nefes egzersizi yapmayı deneyin.',
        challenge: 'Çok sinirliyken aklıma gelmiyor, otomatik yakıyorum.',
        solution: 'Sigara paketinizi her zamanki yerinden (cep, masa) kaldırın, ulaşması zor bir yere koyun. Paketin üzerine "Önce Nefes Al" yazan bir not yapıştırın.'
    },
    {
        id: 'food',
        trigger: 'Yemeklerden Sonra',
        strategy: 'Masa başından hemen kalkın ve ağız tadınızı değiştirin.',
        dialogue: 'Yemek sonrası o "keyif sigarası" aslında bir alışkanlık döngüsü. Yemeğiniz biter bitmez masada oturmaya devam etmeyin. Hemen kalkıp dişlerinizi fırçalayın, nane ferahlığı sigara isteğini kıracaktır.',
        challenge: 'Restoranda veya misafirlikteysem diş fırçalayamıyorum.',
        solution: 'Yanınızda mutlaka naneli sakız, karanfil veya mentollü su bulundurun. Yemekten sonra bir bardak soğuk su içmek de mide dolgunluğu hissini ve sigara isteğini azaltır.'
    },
    {
        id: 'coffee',
        trigger: 'Çay / Kahve ile Birlikte',
        strategy: 'İçecek rutinini geçici olarak değiştirin veya eşlikçiyi farklılaştırın.',
        dialogue: 'Çay ve sigara beyninizde birbirine güçlü şekilde bağlanmış. İlk 2 hafta çayı/kahveyi biraz azaltmayı öneririm. Eğer içecekseniz, kahveyi her zaman içtiğiniz koltukta değil, farklı bir odada veya ayakta için.',
        challenge: 'Kahve içmeden uyanamıyorum ve kahve sigarasız gitmiyor.',
        solution: 'Kahvenizin yanına sigara yerine tarçın çubuğu, bitter çikolata (küçük parça) veya havuç dilimleri koyun. Elinizin boş kalmasını bu şekilde engelleyin.'
    },
    {
        id: 'social',
        trigger: 'Sosyal Ortam / Arkadaşlarla',
        strategy: 'İlk haftalarda riskli ortamlardan kaçının ve "Hayır" deme pratiği yapın.',
        dialogue: 'Arkadaşlarınızın sigara içmesi sizin için en büyük tuzaklardan biri. İlk 2 hafta mümkünse sigara içilen ortamlara girmeyin. Arkadaşlarınıza "Ben bırakma sürecindeyim, lütfen bana ikram etmeyin" diye baştan söyleyin.',
        challenge: 'Dışlandığımı hissediyorum veya irademe hakim olamıyorum.',
        solution: 'Arkadaş grubunda "sigara molasına" çıkıldığında siz masada kalın veya o sırada telefonunuzla ilgilenin. Elinizde bir stres topu, tesbih veya yüzüğünüzle/bilekliğinizle oynayarak el alışkanlığını yönetin.'
    },
    {
        id: 'boredom',
        trigger: 'Can Sıkıntısı / Beklerken',
        strategy: 'Ellerinizi ve zihninizi meşgul edecek 3 dakikalık aktiviteler bulun.',
        dialogue: 'Boş kaldığınızda sigara yakmak bir refleks olmuş. Canınız sıkıldığında hemen elinize bir uğraş almanız lazım. Telefonunuzda bir oyun oynamak, bir arkadaşınızı aramak veya bir bardak su içmek o anki atağı geçiştirir.',
        challenge: 'İş yerinde mola verdiğimde yapacak başka bir şey yok.',
        solution: 'Mola yerinizi değiştirin. Sigara içilen alana gitmek yerine binanın etrafında kısa bir yürüyüş yapın. Bu hem oksijen almanızı sağlar hem de sigara dumanından uzak tutar.'
    },
    {
        id: 'drive',
        trigger: 'Araba Kullanırken',
        strategy: 'Arabanızı sigarasız alan ilan edin ve temizleyin.',
        dialogue: 'Arabanızda sigara kokusu olduğu sürece beyniniz size sigarayı hatırlatacak. Arabanızı detaylı temizletin, küllüğü boşaltıp içine bozuk para veya sakız koyun. Çakmağı torpidoya kaldırın.',
        challenge: 'Trafikte çok geriliyorum.',
        solution: 'Arabanızda sakinleştirici müzikler dinleyin. Yanınızda mutlaka sakız veya çiğnemelik (kuruyemiş vb.) bir şeyler bulundurun. Direksiyonu sıkmak yerine gevşeme hareketleri yapın.'
    }
];

// --- YENİ PSİKOSOSYAL SENARYO MOTORU (BRANCHED LOGIC) ---

export interface ScenarioStep {
    id: string;
    script: string; // Hekimin okuyacağı metin. [Name] ve [Motivation] değişkenlerini içerebilir.
    tip: string;    // Klinik İpucu
    type: 'dialogue' | 'input' | 'scale' | 'cbt_select';
    responses?: { 
        label: string; 
        nextStep: string; 
        type?: 'positive' | 'negative' | 'neutral' | 'danger'; // Buton rengi için
        homework?: string; // Bu seçenek seçilirse atanacak ödev
        insight?: string; // Rapor için not
    }[];
}

// Senaryo Sözlüğü: Tüm dallanmalar burada tanımlanır.
export const PSYCHOSOCIAL_SCENARIOS: Record<string, ScenarioStep> = {
    // --- TAKİP / KONTROL GÖRÜŞMESİ GİRİŞİ (STANDART) ---
    'FOLLOWUP_CHECK': {
        id: 'FOLLOWUP_CHECK',
        type: 'dialogue',
        script: "Tekrar hoş geldiniz [Name] Bey/Hanım. Geçen görüşmemizde size bir 'Ödev' vermiştik. Bu süreçte kendinizi gözlemleme veya deneme şansınız oldu mu?",
        tip: "Yargılamadan sorun. 'Yapmadım' derse kızmayın, nedenini araştırın. 'Yaptım' derse tebrik edin.",
        responses: [
            { label: "Evet, denedim/gözlemledim", nextStep: 'HOMEWORK_REVIEW_POSITIVE', type: 'positive', insight: "Ödev uyumu var." },
            { label: "Hayır, fırsatım olmadı / Unuttum", nextStep: 'HOMEWORK_REVIEW_NEGATIVE', type: 'negative', insight: "Ödev uyumu yok." }
        ]
    },

    // --- TAKİP / KONTROL GÖRÜŞMESİ GİRİŞİ (MEKANİK ÖDEV İÇİN ÖZEL) ---
    'FOLLOWUP_CHECK_MECHANICAL': {
        id: 'FOLLOWUP_CHECK_MECHANICAL',
        type: 'dialogue',
        script: "Tekrar hoş geldiniz [Name] Bey/Hanım. Geçen görüşmemizde size 'Ters El Kuralı'nı (sigarayı diğer elle içme) önermiştik. Bunu uygulama şansınız oldu mu?",
        tip: "Mekanik ödevin (ters el) takibi. Fiziksel bir eylem olduğu için 'evet/hayır' yanıtı daha nettir.",
        responses: [
            { label: "Evet, yaptım (Ters El)", nextStep: 'MECHANICAL_SUCCESS_REVIEW', type: 'positive', insight: "Mekanik ödev uygulandı." },
            { label: "Hayır, yapmadım / Unuttum", nextStep: 'MECHANICAL_FAILURE_REVIEW', type: 'negative', insight: "Mekanik ödev uygulanmadı." }
        ]
    },

    // --- YENİ EKLENEN ADIM: PASİF (ÖDEVSİZ) TAKİP İÇİN GİRİŞ ---
    'FOLLOWUP_PASSIVE': {
        id: 'FOLLOWUP_PASSIVE',
        type: 'dialogue',
        script: "Tekrar hoş geldiniz [Name]. Geçen görüşmemizde sigara konusunu bir süre rafa kaldırma ve sadece rutin kontrol yapma kararı almıştık. Bu anlaşmamıza sadık kalarak soruyorum: Nasılsınız? Hayatınızda, stres seviyenizde veya sağlığınızda önemli bir değişiklik var mı?",
        tip: "SÖZÜNÜZDE DURUN. Sigara konusunu hasta açmadıkça açmayın. İlişkiyi ve güveni koruyun. Ödev sormayın.",
        responses: [
            { label: "İyiyim, değişiklik yok", nextStep: 'RESISTANCE_GENERAL', type: 'neutral', insight: "Hasta pasif konumda kalmayı sürdürüyor." },
            { label: "Aslında aklım hala orada...", nextStep: 'AMBIVALENCE_ENTRY', type: 'positive', insight: "Hasta kendi isteğiyle konuyu açtı (Ambivalans)." },
            { label: "Azalttım / Denemeler yaptım", nextStep: 'HOMEWORK_REVIEW_POSITIVE', type: 'positive', insight: "Beklenmedik değişim (Spontan başarı)." }
        ]
    },

    'MECHANICAL_SUCCESS_REVIEW': {
        id: 'MECHANICAL_SUCCESS_REVIEW',
        type: 'dialogue',
        script: "Harika! Bu basit görünen değişiklik, beyninizdeki otomatik davranış zincirini kırmayı hedefler. Peki, sigarayı ters elle içerken tadında veya isteğinizde bir farklılık hissettiniz mi?",
        tip: "Otomatik pilotun devre dışı kalmasının etkisini sorun (Tadının kötü gelmesi, garip hissetme vb.).",
        responses: [
            { label: "Daha az içtim / Tadı kötü geldi", nextStep: 'SCALE_CHECK', type: 'positive', insight: "Farkındalık arttı, tüketim azaldı." },
            { label: "Fark etmedi ama kurala uydum", nextStep: 'SCALE_CHECK', type: 'neutral', insight: "Uyum tam, etki nötr." }
        ]
    },

    'MECHANICAL_FAILURE_REVIEW': {
        id: 'MECHANICAL_FAILURE_REVIEW',
        type: 'dialogue',
        script: "Anlıyorum, bazen en basit görünen değişiklikler bile zorlayıcı olabilir veya unutulabilir. Bunu yapmanızı engelleyen şey neydi? Unuttunuz mu, yoksa size mantıksız mı geldi?",
        tip: "Yargılamadan engeli anlayın. Eğer 'saçma' bulunduysa artık zorlamayın.",
        responses: [
            { label: "Unuttum / Zor geldi", nextStep: 'PASSIVE_FOLLOWUP', type: 'neutral', insight: "Uyum sorunu (Pasif takibe geç)." },
            { label: "Saçma geldi / İstemiyorum", nextStep: 'PASSIVE_FOLLOWUP', type: 'negative', insight: "Direnç devam ediyor (Pasif takibe geç)." }
        ]
    },

    'HOMEWORK_REVIEW_POSITIVE': {
        id: 'HOMEWORK_REVIEW_POSITIVE',
        type: 'dialogue',
        script: "Harika! Çaba göstermeniz çok değerli. Peki, bu deneyim sırasında ne fark ettiniz? Sigara isteği geldiğinde neler hissettiniz?",
        tip: "Farkındalığı pekiştirin. Başarı hissini (Self-efficacy) güçlendirin.",
        responses: [
            { label: "Zorlandım ama erteledim", nextStep: 'SCALE_CHECK', type: 'positive', insight: "Başarı hissi gelişiyor." },
            { label: "Yine de içtim ama fark ettim", nextStep: 'SCALE_CHECK', type: 'neutral', insight: "Farkındalık artmış." }
        ]
    },
    'HOMEWORK_REVIEW_NEGATIVE': {
        id: 'HOMEWORK_REVIEW_NEGATIVE',
        type: 'dialogue',
        script: "Sorun değil, hayatın koşuşturmacası içinde bazen öncelikler değişebiliyor. Bizi engelleyen şey neydi? Belki ödev size uygun değildi, ne dersiniz?",
        tip: "Suçlamayın. Engeli 'dışsallaştırın'. İşbirliği yapın.",
        responses: [
            { label: "Unuttum / Aklıma gelmedi", nextStep: 'HOMEWORK_REJECTION_PIVOT', type: 'neutral', insight: "Ödev unutuldu, mekaniğe geçiş deneniyor." }, 
            { label: "Çok saçma geldi, yapmadım", nextStep: 'HOMEWORK_REJECTION_PIVOT', type: 'negative', insight: "Zihinsel ödev reddedildi, mekaniğe geçiş." }
        ]
    },

    // --- ÖDEV REDDİ PIVOT NOKTASI (YENİ) ---
    'HOMEWORK_REJECTION_PIVOT': {
        id: 'HOMEWORK_REJECTION_PIVOT',
        type: 'dialogue',
        script: "Dürüstlüğünüz için teşekkürler. Haklısınız, bazen sigara içerken 'neden içiyorum' diye düşünmek insana yapay gelebilir. Demek ki bu 'zihinsel' yöntem size uygun değildi. Peki, düşünce gerektirmeyen, sadece 'mekanik' bir değişiklik yapmayı dener misiniz?",
        tip: "Dirençle karşılaşınca yöntemi değiştirin. İçgörü (farkındalık) odaklı ödev çalışmadıysa, davranış (mekanik) odaklı ödeve geçin.",
        responses: [
            { label: "Nedir o? (Merak)", nextStep: 'ACTION_PLAN_MECHANICAL', type: 'positive', insight: "Alternatif (mekanik) yönteme açık." },
            { label: "Hayır, ödev istemiyorum", nextStep: 'PASSIVE_FOLLOWUP', type: 'negative', insight: "Tam direnç (Pasif takip)." } // DÜZELTİLDİ
        ]
    },

    // --- MEKANİK EYLEM PLANI (YENİ) ---
    'ACTION_PLAN_MECHANICAL': {
        id: 'ACTION_PLAN_MECHANICAL',
        type: 'dialogue',
        script: "Bu hafta sigara sayınıza veya isteğinize hiç karışmayacağız. Sadece tek bir kural var: Sigarayı her zaman kullandığınız elinizle değil, DİĞER elinizle için. (Sağlaksanız sol). Bu, beyindeki otomatik pilotu kapatır ve tadını değiştirir. Sadece bunu yapabilir misiniz?",
        tip: "Ters El Tekniği (Habit Reversal). Basit ama etkilidir, düşünce gerektirmez.",
        responses: [
            { label: "Bunu yapabilirim (Ters El)", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Ters El Kuralı: Sigarayı diğer elinle iç." },
            { label: "Bu da saçma", nextStep: 'PASSIVE_FOLLOWUP', type: 'negative' }
        ]
    },

    // --- PASİF TAKİP / RADİKAL KABULLENME (YENİ) ---
    'PASSIVE_FOLLOWUP': {
        id: 'PASSIVE_FOLLOWUP',
        type: 'dialogue',
        script: "Haklısınız, sizi zorlamanın bir anlamı yok. Belki de şu an hayatınızda bir değişiklik yapmak için doğru zaman değildir. Gelin bu hafta 'sigarayı bırakma' konusunu rafa kaldıralım. Sizden hiçbir şey yapmamanızı istiyorum. Sadece ilişkimizi korumak adına kontrole gelmeye devam edin. Anlaştık mı?",
        tip: "Radikal Kabullenme. Baskıyı tamamen kaldırın. 'Ödevsizlik' anlaşması yapın.",
        responses: [
            { label: "Anlaştık, baskı yok", nextStep: 'FINISH', type: 'neutral', homework: "Ödevsiz Takip: Sigara konusunu açmadan rutin kontrol." }
        ]
    },

    // --- GİRİŞ & BUZKIRAN ---
    'INTRO_GENERAL': {
        id: 'INTRO_GENERAL',
        type: 'dialogue',
        script: "Hoş geldiniz [Name] Bey/Hanım. Bugün buraya gelme sürecinizden biraz bahseder misiniz? Sizi buraya getiren temel düşünce neydi?",
        tip: "Açık uçlu soruyla başlayın. Göz teması kurun ve yargılamadan dinleyin.",
        responses: [
            { label: "Kendi isteğiyle geldi (İstekli)", nextStep: 'SCALE_CHECK', type: 'positive', insight: "İçsel motivasyon mevcut." },
            { label: "Doktor/Aile zoruyla geldi (Tepkili)", nextStep: 'RESISTANCE_DIRECT', type: 'negative', insight: "Dışsal baskı var, direnç yüksek." }, 
            { label: "Kararsız / Emin değil", nextStep: 'SCALE_CHECK', type: 'neutral', insight: "Ambivalans (İkilem) hakim." }
        ]
    },
    'INTRO_PREGNANT': {
        id: 'INTRO_PREGNANT',
        type: 'dialogue',
        script: "Hoş geldiniz [Name] Hanım. Gebeliğiniz hayırlı olsun. Bu özel süreçte sigara kullanımıyla ilgili hislerinizi duymak isterim. Çoğu anne adayı bu konuda karmaşık duygular yaşar.",
        tip: "Suçluluk duygusu çok baskın olabilir. Yargılayıcı görünmekten kaçının. 'Bebek için' vurgusunu şimdilik yapmayın, önce anneyi anlayın.",
        responses: [
            { label: "Çok suçlu hissediyor / Ağlıyor", nextStep: 'PREGNANT_GUILT', type: 'neutral', insight: "Yoğun suçluluk." },
            { label: "Savunmacı (Abartılıyor diyor)", nextStep: 'RESISTANCE_GENERAL', type: 'negative', insight: "İnkar mekanizması (Puanlamasız dirence geçiş)." }, // DÜZELTİLDİ: SCALE öncesi RESISTANCE_ENTRY mantıksızdı
            { label: "Bırakmak istiyor ama zorlanıyor", nextStep: 'SCALE_CHECK', type: 'positive', insight: "Yardım arayışı." }
        ]
    },
    'INTRO_UNDER18': {
        id: 'INTRO_UNDER18',
        type: 'dialogue',
        script: "Selam [Name]. Buraya gelmek senin fikrin miydi, yoksa birileri mi zorladı? Dürüst olabilirsin, aramızda kalacak.",
        tip: "Otorite figürü gibi davranmayın. Bir 'rehber' veya 'abi/abla' tonu kullanın. Gizliliğe vurgu yapın.",
        responses: [
            { label: "Okul/Aile zorladı (Öfkeli)", nextStep: 'UNDER18_FREEDOM', type: 'negative', insight: "Otoriteye direnç." },
            { label: "Ben de rahatsızım (Performans/Koku)", nextStep: 'SCALE_CHECK', type: 'positive', insight: "Akran veya performans kaygısı." }
        ]
    },
    'INTRO_COPD': {
        id: 'INTRO_COPD',
        type: 'dialogue',
        script: "Geçmiş olsun [Name] Bey/Hanım. Nefes darlığınızın hayatınızı nasıl etkilediğini konuşarak başlayalım mı? Mesela torununuzla oynarken veya merdiven çıkarken neler yaşıyorsunuz?",
        tip: "Hastalığın teknik detaylarına girmeyin. Günlük yaşam kısıtlılıklarına (Fonksiyonel kayıp) odaklanın.",
        responses: [
            { label: "Çok zorlanıyorum, korkuyorum", nextStep: 'SCALE_CHECK', type: 'positive', insight: "Hastalık algısı yüksek." },
            { label: "Pek bir etkisini hissetmiyorum / İdare ediyorum", nextStep: 'COPD_DENIAL', type: 'neutral', insight: "İnkar / Düşük farkındalık." }, 
            { label: "Artık çok geç, iş işten geçti", nextStep: 'COPD_DESPAIR', type: 'negative', insight: "Öğrenilmiş çaresizlik." }
        ]
    },
    // YENİ ADIM: KOAH İNKAR / DÜŞÜK FARKINDALIK
    'COPD_DENIAL': {
        id: 'COPD_DENIAL',
        type: 'dialogue',
        script: "Bu harika bir haber, demek ki vücudunuz hala güçlü. Ancak bazen akciğerlerimiz kapasitesi azaldığında, biz fark etmeden hareketlerimizi kısıtlayarak (daha yavaş yürüyerek) buna uyum sağlarız. 5 yıl öncesine kıyasla, hiç duraklamadan merdiven çıkmakta veya yokuşta bir fark hissediyor musunuz?",
        tip: "Hasta inkar ediyor olabilir. Genel 'iyiyim' cevabı yerine spesifik bir eylem (yokuş, merdiven) sorarak farkındalık yaratın.",
        responses: [
            { label: "Evet, aslında biraz tıkanıyorum", nextStep: 'AMBIVALENCE_ENTRY', type: 'positive', insight: "Farkındalık başladı." },
            { label: "Hayır, hiçbir fark yok", nextStep: 'HOMEWORK_OBSERVE', type: 'negative', insight: "Tam inkar (Gözlem ödevine çıkış)." } 
        ]
    },

    // --- ÖLÇEK (SCALE) ---
    'SCALE_CHECK': {
        id: 'SCALE_CHECK',
        type: 'scale',
        script: "Şu anki hislerinize odaklanalım. 0'dan 10'a kadar bir puan verecek olursanız, sigarayı bırakmaya ne kadar hazırsınız? (0: Hiç hazır değilim, 10: Tamamen hazırım)",
        tip: "Hastanın verdiği puana göre yol haritası çizeceğiz. Düşük puan direnci, orta puan ikilemi gösterir.",
        responses: [
            // Logic handled in component based on slider value
            // 0-3 -> RESISTANCE_PATH
            // 4-7 -> AMBIVALENCE_PATH
            // 8-10 -> ACTION_PATH
        ] as any
    },

    // --- ARA ADIM: ÖLÇEK SORGULAMASI (CHANGE RULER) ---
    'SCALE_PROBE': {
        id: 'SCALE_PROBE',
        type: 'dialogue',
        script: "[Score] puan verdiniz. Peki [Name] Bey/Hanım, neden daha düşük bir puan (örneğin [Lower]) değil de [Score] verdiniz? Sizi o düşük puandan ayıran motivasyon nedir?",
        tip: "BU ÇOK KRİTİK BİR SORUDUR. 'Neden daha yüksek değil?' diye sormayın, o zaman engelleri anlatır. 'Neden daha düşük değil?' diye sorarsanız, bırakma nedenlerini (Change Talk) kendisi sıralar.",
        responses: [
            { label: "Çünkü bırakmak istiyorum / Sebeplerim var", nextStep: 'CALCULATED_PATH', type: 'positive', insight: "Change Talk (Değişim konuşması) alındı." },
            { label: "Öylesine söyledim / Bilmiyorum", nextStep: 'CALCULATED_PATH', type: 'neutral', insight: "Farkındalık henüz oluşmamış." },
            { label: "Bırakmaya niyetim yok / Yapabileceğimi sanmıyorum", nextStep: 'PASSIVE_FOLLOWUP', type: 'negative', insight: "Umutsuzluk beyanı (Pasif takibe çıkış)." } // DÜZELTİLDİ
        ]
    },

    // --- DİRENÇ YOLU (0-3 PUAN) ---
    'RESISTANCE_ENTRY': {
        id: 'RESISTANCE_ENTRY',
        type: 'dialogue',
        script: "Puanınızın düşük olması çok normal. Demek ki şu an sigaranın hayatınızda önemli bir işlevi var. Sizi bırakmaktan alıkoyan, 'bırakırsam kötü olur' dediğiniz en büyük endişe nedir?",
        tip: "İkna etmeye ÇALIŞMAYIN. Sadece endişeyi anlayın. 'Dirençle Yuvarlanma' tekniğini kullanın.",
        responses: [
            { label: "Stresle baş edemem", nextStep: 'RESISTANCE_STRESS', type: 'neutral', insight: "Stres baş etme mekanizması eksik." },
            { label: "Kilo alırım", nextStep: 'RESISTANCE_WEIGHT', type: 'neutral', insight: "Estetik kaygı." },
            { label: "Benim tek keyfim bu", nextStep: 'RESISTANCE_PLEASURE', type: 'negative', insight: "Hedoni odaklı (Haz ve Keyif Arayışı)." }
        ]
    },

    // YENİ: GENEL DİRENÇ (Puan referansı içermeyen nötr giriş)
    'RESISTANCE_GENERAL': {
        id: 'RESISTANCE_GENERAL',
        type: 'dialogue',
        script: "Bu dürüstlüğünüz için teşekkür ederim. Sigaranın şu an hayatınızda belirgin bir olumsuzluğa yol açmadığını düşünüyorsunuz. Peki, yine de 'keşke içmesem' dediğiniz anlar oluyor mu? Sizi bırakmaktan alıkoyan en temel endişe nedir?",
        tip: "Hasta 'zarar görmüyorum' diyorsa, algıyı 'riskler'den 'engeller'e kaydırın.",
        responses: [
            { label: "Stresle baş edemem", nextStep: 'RESISTANCE_STRESS', type: 'neutral', insight: "Stres baş etme mekanizması eksik." },
            { label: "Kilo alırım", nextStep: 'RESISTANCE_WEIGHT', type: 'neutral', insight: "Estetik kaygı." },
            { label: "Benim tek keyfim bu", nextStep: 'RESISTANCE_PLEASURE', type: 'negative', insight: "Hedoni odaklı." }
        ]
    },

    // --- YENİ EKLENEN ADIM: DOĞRUDAN DİRENÇ (PUANLAMASIZ GİRİŞ) ---
    'RESISTANCE_DIRECT': {
        id: 'RESISTANCE_DIRECT',
        type: 'dialogue',
        script: "Anlıyorum, buraya gelmek tamamen sizin özgür iradenizle olmadı. Bu durumda isteksiz veya tepkili hissetmeniz çok doğal. Peki, madem buradayız, sigara kullanımıyla ilgili 'keşke olmasaydı' dediğiniz en ufak bir şey var mı?",
        tip: "Zoraki gelişlerde 'Puan' konuşulmaz. Doğrudan hastanın öfkesini onaylayın (Validasyon) ve çok küçük bir 'değişim kapısı' arayın.",
        responses: [
            { label: "Aslında öksürük beni yoruyor", nextStep: 'AMBIVALENCE_ENTRY', type: 'positive', insight: "Direnç kırıldı, ikilem başladı." },
            { label: "Hayır, ben halimden memnunum", nextStep: 'PASSIVE_FOLLOWUP', type: 'negative', insight: "Tam direnç (Pasif Takip ile çıkış)." } // DÜZELTİLDİ: Gözlem ödevi yerine tam çıkış.
        ]
    },
    'RESISTANCE_STRESS': {
        id: 'RESISTANCE_STRESS',
        type: 'dialogue',
        script: "Haklısınız, sigara anlık bir kaçış sağlıyor. Peki, sigara içmenizin fiziksel olarak mümkün olmadığı durumlarda (örneğin uçak yolculuğunda, hastanede veya önemli bir ibadet sırasında) gerginliğinizi yönetmek için ne yapıyorsunuz?",
        tip: "Alternatif baş etme mekanizmalarını araştırın (Yemek, tesbih, diş sıkma vb.).",
        responses: [
            { label: "Dayanamam, kaçıp içerim", nextStep: 'HOMEWORK_OBSERVE', type: 'negative', insight: "Alternatif baş etme yöntemi yok, kaçınma var." },
            { label: "Yemek yerim / Atıştırırım", nextStep: 'STRENGTH_BUILDING_ORAL', type: 'neutral', insight: "Oral fiksasyon (Yeme dürtüsü) var." },
            { label: "Elimde bir şeyle oynarım (Tesbih/Takı/Stres Topu)", nextStep: 'STRENGTH_BUILDING', type: 'positive', insight: "Mekanik/Manevi oyalama mevcut." },
            { label: "Sadece sabrederim / Dişimi sıkarım", nextStep: 'STRENGTH_BUILDING', type: 'neutral', insight: "Pasif direnç." }
        ]
    },
    'RESISTANCE_PLEASURE': {
        id: 'RESISTANCE_PLEASURE',
        type: 'dialogue',
        script: "Hayatın koşuşturmacası içinde kendinize ayırdığınız bu özel ana saygı duyuyorum. Peki, [Motivation] konusunu düşündüğünüzde; bu durum mu sizin için daha ağır basıyor, yoksa o balkon molası mı?",
        tip: "Değerler ile davranış arasındaki çelişkiyi (Discrepancy) nazikçe gösterin.",
        responses: [
            { label: "Tabii ki [Motivation]", nextStep: 'ACTION_PLAN_SMALL', type: 'positive', insight: "Değer çatışması motivasyon lehine çözüldü." },
            { label: "İkisi farklı şeyler (Defansif)", nextStep: 'PASSIVE_FOLLOWUP', type: 'negative', insight: "İnkar devam ediyor (Pasif Takip ile çıkış)." } // DÜZELTİLDİ
        ]
    },
    // YENİ: EKSİK OLAN KİLO ADIMI
    'RESISTANCE_WEIGHT': {
        id: 'RESISTANCE_WEIGHT',
        type: 'dialogue',
        script: "Kilo konusu, sigarayı bırakmayı deneyen pek çok kişinin ortak endişesidir. Sigarayı bırakınca metabolizma bir miktar değişebilir ancak asıl kilo alımı, sigara yerine 'atıştırmalık' koymaktan kaynaklanır. Eğer beslenme düzeninize dikkat edersek bu kiloyu almayabilirsiniz. Bunu denemeye değer bulur musunuz?",
        tip: "Kilo alımının kaçınılmaz olmadığını anlatın.",
        responses: [
            { label: "Denerim", nextStep: 'STRENGTH_BUILDING_ORAL', type: 'positive' },
            { label: "Risk alamam", nextStep: 'HOMEWORK_OBSERVE', type: 'negative' }
        ]
    },

    // --- ÖZEL PROFİL DALLANMALARI ---
    'PREGNANT_GUILT': {
        id: 'PREGNANT_GUILT',
        type: 'dialogue',
        script: "Gözyaşlarınız, bebeğinizi ne kadar önemsediğinizi gösteriyor. Bu suçluluk duygusu çok ağır bir yük. Gelin bu yükü 'sorumluluğa' dönüştürelim. Her içmediğiniz sigara, bebeğinize giden oksijen miktarını artırıyor. Bunu başarmak için 'Ya hep ya hiç' demek yerine, her ertelemeyi bir zafer saysak?",
        tip: "Suçluluk paralize eder (dondurur). Küçük başarıları (erteleme) kutlayarak öz yeterliliği artırın.",
        responses: [
            { label: "Deneyebilirim (Erteleme)", nextStep: 'ACTION_PLAN_SMALL', type: 'positive', homework: "İstek gelince 10dk ertele ve su iç." },
            { label: "Yapamıyorum, çok sinirliyim", nextStep: 'CBT_TRIGGER_SELECT', type: 'neutral' }
        ]
    },
    'UNDER18_FREEDOM': {
        id: 'UNDER18_FREEDOM',
        type: 'dialogue',
        script: "Sana ne yapacağını söylemek istemiyorum. Sadece şunu merak ediyorum: Sigara şirketleri senin gibi gençleri hedef alarak milyarlar kazanıyor. Sence bir pakete bağımlı olup her gün onlara para ödemek mi özgürlük, yoksa 'Beni yönetemezsiniz' deyip bırakmak mı?",
        tip: "Sağlık zararlarından (kanser vb.) bahsetmeyin, gençler bunu umursamaz. 'Özerklik' ve 'Manipülasyona karşı duruş' üzerinden gidin.",
        responses: [
            { label: "Hiç böyle düşünmemiştim", nextStep: 'ACTION_PLAN_SMALL', type: 'positive', homework: "Sigara şirketlerinin taktiklerini araştır." },
            { label: "Umrumda değil, seviyorum", nextStep: 'PASSIVE_FOLLOWUP', type: 'negative' } // DÜZELTİLDİ: Gençlerde Gözlem ödevi yerine tam çıkış.
        ]
    },
    'COPD_DESPAIR': {
        id: 'COPD_DESPAIR',
        type: 'dialogue',
        script: "Bazen 'Zaten olan oldu' diye düşünmek çok insani. Ama akciğerlerinizde hala çalışan, nefes alan milyonlarca hücre var. Bizim amacımız onları korumak. [Motivation] için daha rahat nefes aldığınız bir gelecek hayal edebilir misiniz?",
        tip: "Umut aşılayın. Kaybedilene değil, korunacak olana (Kalan kapasite) odaklanın.",
        responses: [
            { label: "Belki biraz daha rahatlarım", nextStep: 'ACTION_PLAN_SMALL', type: 'positive' },
            { label: "İnanmıyorum", nextStep: 'PASSIVE_FOLLOWUP', type: 'negative' } // DÜZELTİLDİ
        ]
    },

    // --- İKİLEM (AMBIVALANCE) YOLU (4-7 PUAN) ---
    'AMBIVALENCE_ENTRY': {
        id: 'AMBIVALENCE_ENTRY',
        type: 'dialogue',
        script: "Bir yanınız bırakmak istiyor, diğer yanınız bırakamıyor. Bu çok yaygın bir durum. Gelin teraziyi kuralım. Sigara içmenin size 'iyi gelen' yanları neler? (Önce iyi yanları sorun)",
        tip: "Önce sigaranın 'faydalarını' sormak hastayı şaşırtır ve savunmasını düşürür. Sonra zararlara geçin.",
        responses: [
            { label: "Rahatlatıyor / Keyif veriyor", nextStep: 'AMBIVALENCE_CONS', type: 'neutral', insight: "Haz odaklı kullanım." },
            { label: "Stresimi azaltıyor / Sakinleştiriyor", nextStep: 'AMBIVALENCE_CONS', type: 'neutral', insight: "Stres baş etme aracı." }, 
            { label: "Dikkatimi topluyor / Odaklanıyorum", nextStep: 'AMBIVALENCE_CONS', type: 'neutral', insight: "Bilişsel performans inancı." }, 
            { label: "Sosyalleşiyorum / Ortamım böyle", nextStep: 'AMBIVALENCE_CONS', type: 'neutral', insight: "Sosyal aidiyet aracı." } 
        ]
    },
    'AMBIVALENCE_CONS': {
        id: 'AMBIVALENCE_CONS',
        type: 'dialogue',
        script: "Peki, terazinin diğer kefesinde neler var? Sigara içmek [Motivation] hedefinizi veya günlük hayatınızı nasıl zorlaştırıyor?",
        tip: "Hastanın kendi ağzından 'değişim konuşmaları' (Change Talk) yapmasını sağlayın.",
        responses: [
            { label: "Nefesim daralıyor / Param gidiyor", nextStep: 'ACTION_PLAN_SMALL', type: 'positive' },
            { label: "Pek bir zararı yok aslında", nextStep: 'HOMEWORK_OBSERVE', type: 'negative', insight: "Risk algısı düşük, gözlem ödevine çıkış." } 
        ]
    },

    // --- EYLEM VE BDT YOLU (8-10 PUAN) ---
    'ACTION_PATH': {
        id: 'ACTION_PATH',
        type: 'dialogue',
        script: "Harika! Kararlılığınız çok yüksek (Puanınız yüksek). Şimdi bu isteği somut bir plana dökelim. Sizi en çok zorlayan anı (tetikleyiciyi) bulup onu etkisiz hale getirelim.",
        tip: "Direkt çözüm odaklı gidin. BDT tekniklerini (Tetikleyici -> Alternatif Davranış) kullanın.",
        responses: [
            { label: "Tetikleyicileri belirle", nextStep: 'CBT_TRIGGER_SELECT', type: 'positive' }
        ]
    },

    // --- BDT ARAÇLARI (TRIGGER SELECTION) ---
    'CBT_TRIGGER_SELECT': {
        id: 'CBT_TRIGGER_SELECT',
        type: 'cbt_select',
        script: "Hangi anlarda sigara yakma isteğiniz kontrol edilemez hale geliyor? (Aşağıdan seçiniz)",
        tip: "Hastanın en zayıf anını bulup ona özel 'Reçete' (Alternatif davranış) sunun.",
        responses: [
             { label: "😡 Stres / Sinirlilik Anında", nextStep: 'CBT_SOLUTION_STRESS', type: 'danger' },
             { label: "☕ Çay / Kahve Keyfinde", nextStep: 'CBT_SOLUTION_COFFEE', type: 'neutral' },
             { label: "🍽️ Yemekten Hemen Sonra", nextStep: 'CBT_SOLUTION_MEAL', type: 'neutral' },
             { label: "👯 Sosyal Ortam / Arkadaşlar", nextStep: 'CBT_SOLUTION_SOCIAL', type: 'danger' },
             { label: "🥱 Can Sıkıntısı / Beklerken", nextStep: 'CBT_SOLUTION_BOREDOM', type: 'neutral' },
             { label: "🚗 Araba Kullanırken", nextStep: 'CBT_SOLUTION_DRIVE', type: 'neutral' }
        ] as any
    },

    // --- YENİ ADIM: PAZARLIK (NEGOTIATION) ---
    'CBT_BARGAINING': {
        id: 'CBT_BARGAINING',
        type: 'dialogue',
        script: "Anlıyorum, bu öneri şu anki yaşam düzeninize uymuyor olabilir. Tedavide en iyi yöntem, sizin 'yapabileceğinize inandığınız' yöntemdir. Peki, önerdiğimiz şeyi tamamen yapmak yerine, sadece 'erteleme' taktiğini uygulasak? Sigara isteği geldiğinde sadece 10 dakika bekleyip su içebilir misiniz?",
        tip: "Dirençle karşılaşınca geri adım atın ve hedefi küçültün (Pazarlık). Hasta 'Hayır' diyemeyeceği kadar küçük bir adımla karşılaşmalı.",
        responses: [
            { label: "Bunu yapabilirim (10dk Kuralı)", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "İstek gelince 10 dakika ertele." },
            { label: "Bunu da yapamam", nextStep: 'HOMEWORK_OBSERVE', type: 'negative' } // Fallback to observation
        ]
    },

    'CBT_SOLUTION_STRESS': {
        id: 'CBT_SOLUTION_STRESS',
        type: 'dialogue',
        script: "Stres anında sigara, sadece nikotin açlığını giderdiği için sizi 'kandırır'. Bunun yerine: 4 saniye nefes al, 7 saniye tut, 8 saniye ver. Bu egzersiz, beyninize sigaradan daha hızlı 'sakinleş' sinyali gönderir. Bunu deneyelim mi?",
        tip: "Nefes egzersizini seansta 1 kez birlikte uygulayın.",
        responses: [
            { label: "Tamam, deneyeceğim", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Stres anında 4-7-8 nefes taktiği uygula." },
            { label: "İşe yaramaz / Yapamam", nextStep: 'CBT_BARGAINING', type: 'neutral' }
        ]
    },
    'CBT_SOLUTION_COFFEE': {
        id: 'CBT_SOLUTION_COFFEE',
        type: 'dialogue',
        script: "Kahve ve sigara beyninizde 'yapışık ikizler' gibi. Bir süre onları ayıralım. Kahvenizi her zamanki koltuğunuzda değil, ayakta veya balkonsuz bir odada için. Ve yanına sigara yerine bir parça bitter çikolata koyun.",
        tip: "Mekan ve eşlikçi değişikliği (Stimulus Control) önerin.",
        responses: [
            { label: "🍫 Çikolata ile eşleştiririm", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Kahve yanında sigara yerine çikolata ye." },
            { label: "🚶 Ayakta içerim", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Kahveyi ayakta veya balkonsuz odada iç." },
            { label: "Bunlar bana uymaz", nextStep: 'CBT_BARGAINING', type: 'negative' }
        ]
    },
    'CBT_SOLUTION_MEAL': {
        id: 'CBT_SOLUTION_MEAL',
        type: 'dialogue',
        script: "Yemek sonrası masada kalmak en büyük tuzak. Kuralımız şu: Son lokma biter bitmez 'Masayı Terk Et'. Hemen lavaboya gidip dişlerini fırçala. Nane tadı sigara isteğini kıracaktır.",
        tip: "3 dakika kuralı: İstek 3 dakika sürer. Bu süreyi diş fırçalayarak geçiştirin.",
        responses: [
            { label: "Denerim", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Yemekten hemen sonra diş fırçala." },
            { label: "Çok zor / Yapamam", nextStep: 'CBT_BARGAINING', type: 'negative' }
        ]
    },
    'CBT_SOLUTION_SOCIAL': {
        id: 'CBT_SOLUTION_SOCIAL',
        type: 'dialogue',
        script: "Arkadaşlarınızın sigara içmesi en büyük tuzak. İlk 2 hafta bu ortamlara girmemeyi veya 'Ben bırakma sürecindeyim, lütfen ikram etmeyin' diyerek sınır çizmeyi deneyebilir misiniz?",
        tip: "Sosyal baskıya karşı 'Hayır' deme (Assertiveness) becerisi kazandırın.",
        responses: [
            { label: "🚫 Ortamlara girmem", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "İlk 2 hafta sigara içilen ortamlardan uzak dur." },
            { label: "🗣️ 'Hayır' derim", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Arkadaşlarına bıraktığını söyle ve ikramı reddet." },
            { label: "İmkansız / Yapamam", nextStep: 'CBT_BARGAINING', type: 'negative' }
        ]
    },
    'CBT_SOLUTION_BOREDOM': {
        id: 'CBT_SOLUTION_BOREDOM',
        type: 'dialogue',
        script: "Boşluk anında eliniz otomatik gidiyor. O anı dolduracak 3 dakikalık bir 'Can Simidi' bulalım. Telefon oyunu, el kremi sürmek, tesbih, bileklik, yüzük veya stres topu ile oynamak... Sizin can simidiniz ne olsun?",
        tip: "Oyalama taktiği (Distraction).",
        responses: [
            { label: "📱 Telefonda oyun oynarım", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "İstek gelince telefonla ilgilen." },
            { label: "📿 Tesbih / Takı / Stres topu", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "İstek gelince elini bir nesneyle oyala." },
            { label: "🧴 El Kremi / Kolonya", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "İstek gelince el kremi veya kolonya kullan." },
            { label: "📞 Arkadaşımı ararım", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "İstek gelince birini ara." },
            { label: "Hiçbiri bana uymaz", nextStep: 'CBT_BARGAINING', type: 'negative' }
        ]
    },
    'CBT_SOLUTION_DRIVE': {
        id: 'CBT_SOLUTION_DRIVE',
        type: 'dialogue',
        script: "Araba kullanırken sigara içmek bir refleks olmuş. Önce arabanızı detaylı temizletin, o koku gitsin. Çakmağı torpidoya atın. Direksiyonu sıkmak yerine sakin müzikler açıp sakız çiğnemeyi deneyin.",
        tip: "Mekan temizliği ve tetikleyici nesnelerin (çakmak/küllük) kaldırılması.",
        responses: [
            { label: "🚗 Arabayı temizleteceğim", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Arabayı detaylı temizlet ve sigarasız ilan et." },
            { label: "🎵 Müzik ve Sakız", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Araba sürerken sakız çiğne ve müzik dinle." },
            { label: "Çok zor / Yapamam", nextStep: 'CBT_BARGAINING', type: 'negative' }
        ]
    },

    // --- KAPANIŞLAR ---
    'HOMEWORK_OBSERVE': {
        id: 'HOMEWORK_OBSERVE',
        type: 'dialogue',
        script: "Bugün her konuda anlaşmak zorunda değiliz. Sizden sadece küçük bir ricam var: Bir sonraki görüşmemize kadar, her sigara yaktığınızda kendinize 'Bunu şu an gerçekten istiyor muyum, yoksa sadece elim mi gidiyor?' diye sorun. Sadece gözlemleyin, hepsi bu.",
        tip: "Dirençli hastaya eylem değil, farkındalık ödevi verilir. Kapıyı açık bırakın.",
        responses: [
            { label: "Tamam, sadece gözlemleyeceğim", nextStep: 'FINISH', type: 'neutral', homework: "Gözlem Ödevi: Sigara isteği ile davranışı ayırt etme." }
        ]
    },
    'ACTION_PLAN_SMALL': {
        id: 'ACTION_PLAN_SMALL',
        type: 'dialogue',
        script: "Büyük hedefler bazen korkutucudur. Bu hafta sadece 'Erteleme Oyunu' oynayalım. İstek geldiğinde 10 dakika bekle. O sırada bir bardak su iç veya [Motivation] düşün. 10 dakika sonra hala istiyorsan içebilirsin. Anlaştık mı?",
        tip: "Pazarlık tekniği. 'İçme' demiyoruz, 'Ertele' diyoruz. Bu daha kabul edilebilirdir.",
        responses: [
            { label: "Anlaştık, 10 dk kuralı", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "İstek gelince 10 dakika ertele." }
        ]
    },
    'CLOSING_SUCCESS': {
        id: 'CLOSING_SUCCESS',
        type: 'dialogue',
        script: "Bugün harika bir adım attınız. [Motivation] için yaptığınız bu plan çok değerli. Haftaya bu yeni taktiklerin nasıl gittiğini konuşmak üzere sizi bekliyor olacağım.",
        tip: "Olumlu pekiştirme yapın ve randevuyu netleştirin.",
        responses: [
            { label: "Görüşmeyi Bitir", nextStep: 'FINISH', type: 'positive' }
        ]
    },

    // --- ARA YOLLAR ---
    'STRENGTH_BUILDING': {
        id: 'STRENGTH_BUILDING',
        type: 'dialogue',
        script: "Görüyorsunuz, sigara olmadan da zorluklara göğüs gerebilecek bir iç güce veya yöntemlere sahipsiniz. Bu hafta stresli anlarda sigaraya sarılmadan önce bu mevcut gücünüzü (Sabır, dua, oyalama) bilinçli olarak devreye sokmayı deneyin.",
        tip: "Öz yeterliliği (Self-efficacy) destekleyin.",
        responses: [
            { label: "Deneyeceğim", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Alternatif yöntemleri artır." }
        ]
    },
    'STRENGTH_BUILDING_ORAL': {
        id: 'STRENGTH_BUILDING_ORAL',
        type: 'dialogue',
        script: "Sigara yerine bir şeyler atıştırmak, o boşluğu doldurmanın en sık görülen yoludur. Ancak stresi yemekle bastırmak istenmeyen kilolara sebep olabilir. Bunun yerine su içmeyi, sakız çiğnemeyi veya 4-7-8 nefes taktiğini koyabilir miyiz?",
        tip: "Oral fiksasyon uyarısı ve sağlıklı alternatif önerisi.",
        responses: [
            { label: "Su veya sakız denerim", nextStep: 'CLOSING_SUCCESS', type: 'positive', homework: "Sigara isteği gelince su iç veya sakız çiğne." },
            { label: "Sanmıyorum, yerim", nextStep: 'HOMEWORK_OBSERVE', type: 'negative', insight: "Kilo alma riski yüksek, dirençli." }
        ]
    }
};
