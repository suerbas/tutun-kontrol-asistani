import { DrugInfo, COMORBIDITIES, SpecialProfile } from '../types';

// --- BİLİŞSEL ÇARPITMALAR (COGNITIVE DISTORTIONS) ---
export const COGNITIVE_DISTORTIONS = [
    {
        id: 'all_or_nothing',
        name: 'Ya Hep Ya Hiç Düşüncesi',
        description: 'Her şeyi siyah-beyaz olarak görme. Ara tonları kabul etmeme.',
        smokingExample: '"Bir tane içersem battı, artık tamamen başarısızım."',
        challenge: 'Bir kayma (slip) nüks (relaps) değildir. Yolculuğa devam edebilirsin.'
    },
    {
        id: 'catastrophizing',
        name: 'Felaketleştirme',
        description: 'Her zaman en kötü senaryoyu öngörme.',
        smokingExample: '"Bırakırsam kesin çıldırırım, işimi kaybederim."',
        challenge: 'Yoksunluk belirtileri geçicidir (1-2 hafta). Çoğu kişi normal hayatına devam eder.'
    },
    {
        id: 'mind_reading',
        name: 'Zihin Okuma',
        description: 'Başkalarının ne düşündüğünü bildiğini sanma.',
        smokingExample: '"Herkes benim sigarasız ne kadar sinirli olduğumu görüyor."',
        challenge: 'Gerçekten sordun mu? Çoğu insan senin kadar dikkat etmiyor.'
    },
    {
        id: 'labeling',
        name: 'Etiketleme',
        description: 'Kendine veya başkalarına olumsuz sıfat takma.',
        smokingExample: '"Ben iradesiz biriyim, bırakmak benim harcım değil."',
        challenge: 'Bağımlılık irade eksikliği değil, beyin kimyasıdır. Tedavi ile yönetilebilir.'
    },
    {
        id: 'discounting',
        name: 'Olumluyu Küçümseme',
        description: 'Başarıları görmezden gelme veya önemsizleştirme.',
        smokingExample: '"3 gün dayandım ama o zaten kolaydı, asıl zor olan..."',
        challenge: 'Her gün bir zaferdir. Küçük adımlar büyük değişimlere yol açar.'
    },
    {
        id: 'emotional_reasoning',
        name: 'Duygusal Akıl Yürütme',
        description: 'Hisleri gerçekmiş gibi kabul etme.',
        smokingExample: '"Sigara içmek istiyorum, demek ki gerçekten ihtiyacım var."',
        challenge: 'İstek duygusu geçicidir. 3-5 dakika bekle, azalacaktır.'
    },
    {
        id: 'fortune_telling',
        name: 'Falcılık',
        description: 'Geleceği olumsuz olarak tahmin etme.',
        smokingExample: '"Daha önce denedim olmadı, bu sefer de olmayacak."',
        challenge: 'Her deneme farklıdır. Bu sefer farklı araçların ve desteğin var.'
    },
    {
        id: 'should_statements',
        name: 'Zorunluluk Cümleleri',
        description: '"Yapmalıyım, etmeliyim" ile kendine baskı yapma.',
        smokingExample: '"Artık bırakmış olmalıydım, bu yaştan sonra ayıp."',
        challenge: '"Yapmalıyım" yerine "yapmak istiyorum" de. Değişim hazır olduğunda gelir.'
    }
];

// --- DUYGULAR LİSTESİ (BDT Düşünce Kaydı için) ---
export const EMOTIONS = [
    { id: 'anxiety', name: 'Kaygı / Endişe', icon: '😰' },
    { id: 'anger', name: 'Öfke / Sinir', icon: '😠' },
    { id: 'sadness', name: 'Üzüntü / Hüzün', icon: '😢' },
    { id: 'stress', name: 'Stres / Gerginlik', icon: '😤' },
    { id: 'boredom', name: 'Sıkıntı / Can Sıkıntısı', icon: '😑' },
    { id: 'loneliness', name: 'Yalnızlık', icon: '😔' },
    { id: 'frustration', name: 'Hayal Kırıklığı', icon: '😩' },
    { id: 'craving', name: 'Şiddetli İstek', icon: '🔥' }
];

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
