import { DrugInfo, COMORBIDITIES } from '../types';

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
        dosage: "Günde >10 sigara içenlerde: 21mg/24saat. Günde ≤10 sigara içenlerde: 14mg/24saat ile başlanır.",
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
        contraindications: [COMORBIDITIES.EPILEPSY, "Yeme bozukluğu (Anoreksiya/Blumia)", "MAO inhibitörü kullanımı", "Ağır kafa travması öyküsü", "18 yaş altı (güvenlilik ve etkinlik verisi yok; önerilmez)"],
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
        contraindications: ["Stabil olmayan anjina", "Yakın zamanda MI", "Gebelik/Emzirme", "Şiddetli hipertansiyon", "18 yaş altı (yeterli veri yok)"],
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
                effect: "Tedavi sırasında sigara içmeye devam etme",
                management: "Tedavinin 5. gününden sonra hâlâ sigara içiliyorsa ilaç kesilmelidir; ilaç ve sigara birlikte önerilmez. Bir süre sonra yeniden denenebilir."
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
            { id: 'rb_1', text: 'Yoksunluk Belirtileri (Sinirlilik, İstek)', solution: 'İlaç tedavisi (NRT/Champix) yoksunluk belirtilerini hafifletir ve bırakma olasılığını belirgin biçimde artırır.' },
            { id: 'rb_2', text: 'Kilo Alma Korkusu', solution: 'Bırakınca metabolizma biraz yavaşlar ama sağlıklı atıştırmalıklar ve yürüyüşle bu kontrol edilebilir. Kilo alımı genellikle 2-4 kg düzeyindedir.' },
            { id: 'rb_3', text: 'Stresle Baş Edememe', solution: 'Sigara, asıl olarak nikotin eksikliğinden kaynaklanan gerginliği giderir; kalıcı bir stres yönetimi sağlamaz. Nefes egzersizleri ve yürüyüş gerçek stresi azaltır.' },
            { id: 'rb_4', text: 'Sosyal Çevre (Arkadaşlarım içiyor)', solution: 'İlk haftalarda sigara içilen ortamlardan uzak durun. Onlara bıraktığınızı söyleyin ve destek isteyin.' },
            { id: 'rb_5', text: 'Başarısızlık Korkusu (Daha önce denedim)', solution: 'Her deneme bir tecrübedir. Bırakanların çoğu birden fazla deneme yapmıştır. Bu sefer farklı bir yöntem (ilaç+destek) deneyeceğiz.' }
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
