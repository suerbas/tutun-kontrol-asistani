import { DrugInfo, COMORBIDITIES, SpecialProfile } from '../types';

// --- BİLİŞSEL ÇARPITMALAR (COGNITIVE DISTORTIONS) - ZENGİNLEŞTİRİLMİŞ ---
export const COGNITIVE_DISTORTIONS = [
    {
        id: 'all_or_nothing',
        name: 'Ya Hep Ya Hiç Düşüncesi',
        description: 'Her şeyi siyah-beyaz olarak görme. Ara tonları kabul etmeme.',
        smokingExample: '"Bir tane içersem battı, artık tamamen başarısızım."',
        challenge: 'Bir kayma (slip) nüks (relaps) değildir. Yolculuğa devam edebilirsin.',
        clientReactions: [
            { reaction: '"Ama bir tane içtim, artık her şey bitti!"', response: 'Bir kayma, yolculuğun sonu değil. Düştüğünüz yerden kalkmak önemli. Bugüne kadar içmediğiniz sigaralar hâlâ kazanılmış zaferlerdir.' },
            { reaction: '"Ya tamamen bırakırım ya hiç uğraşmam."', response: 'Azaltma da bir başarıdır. Günde 20 yerine 10 sigara içmek, vücudunuzun maruz kaldığı zararı yarıya indirmek demektir.' }
        ],
        therapeuticQuestions: [
            'Bu düşünce sizi nasıl hissettiriyor?',
            'Bir arkadaşınız aynı durumda olsa ona ne derdiniz?',
            '%100 başarısızlık ile %100 başarı arasında başka bir nokta olabilir mi?'
        ],
        copingStrategies: [
            'Gri tonları kabul etme: "Mükemmel olmak zorunda değilim, ilerleme yeterli."',
            'Başarı günlüğü tutma: Her sigarasız günü not edin.',
            'Kayma durumunda: "Bu bir öğrenme fırsatı, devam ediyorum." diye tekrarlayın.'
        ]
    },
    {
        id: 'catastrophizing',
        name: 'Felaketleştirme',
        description: 'Her zaman en kötü senaryoyu öngörme.',
        smokingExample: '"Bırakırsam kesin çıldırırım, işimi kaybederim."',
        challenge: 'Yoksunluk belirtileri geçicidir (1-2 hafta). Çoğu kişi normal hayatına devam eder.',
        clientReactions: [
            { reaction: '"Sigarasız dayanamam, çıldırırım!"', response: 'Yoksunluk belirtileri en yoğun ilk 3 gündür ve 2 hafta içinde büyük ölçüde azalır. Milyonlarca insan bu süreci başarıyla geçirdi.' },
            { reaction: '"Bırakırsam kilo alırım, sağlığım daha da bozulur."', response: 'Ortalama kilo alımı 2-4 kg\'dır ve kontrol edilebilir. Sigara içmeye devam etmenin riskleri, olası kilo alımından çok daha fazladır.' }
        ],
        therapeuticQuestions: [
            'En kötü senaryonun gerçekleşme olasılığı gerçekten ne kadar?',
            'Daha önce zor bir durumun üstesinden geldiniz mi? Nasıl başardınız?',
            'Bu felaket senaryosu gerçekleşse bile baş edebilir misiniz?'
        ],
        copingStrategies: [
            'Olasılık değerlendirmesi: Korkunun gerçekleşme şansını %0-100 arasında puanlayın.',
            'En kötü/en iyi/en olası senaryo analizi yapın.',
            'Geçmişteki başarılı baş etme deneyimlerini hatırlayın.'
        ]
    },
    {
        id: 'mind_reading',
        name: 'Zihin Okuma',
        description: 'Başkalarının ne düşündüğünü bildiğini sanma.',
        smokingExample: '"Herkes benim sigarasız ne kadar sinirli olduğumu görüyor."',
        challenge: 'Gerçekten sordun mu? Çoğu insan senin kadar dikkat etmiyor.',
        clientReactions: [
            { reaction: '"Arkadaşlarım beni yargılıyor, bırakamadığım için."', response: 'Bunu size söylediler mi? Çoğu insan kendi hayatıyla meşguldür. Belki de sizi desteklemek isterler ama nasıl yapacaklarını bilmiyorlardır.' },
            { reaction: '"İş yerinde sinirli olduğumu fark edecekler."', response: 'İnsanlar genellikle tahmin ettiğimiz kadar dikkatli değildir. Ayrıca, geçici bir dönem olduğunu açıkça söyleyebilirsiniz.' }
        ],
        therapeuticQuestions: [
            'Bu düşüncenin kanıtı nedir?',
            'Karşınızdaki kişiye doğrudan sordunuz mu?',
            'Siz başkalarının davranışlarını ne kadar dikkatle izliyorsunuz?'
        ],
        copingStrategies: [
            'Varsayımları test edin: Güvendiğiniz birine sorun.',
            'Dikkat odağını değiştirin: Başkaları da sizin kadar kendileriyle meşgul.',
            'Şeffaf iletişim: Bırakma sürecinde olduğunuzu paylaşın.'
        ]
    },
    {
        id: 'labeling',
        name: 'Etiketleme',
        description: 'Kendine veya başkalarına olumsuz sıfat takma.',
        smokingExample: '"Ben iradesiz biriyim, bırakmak benim harcım değil."',
        challenge: 'Bağımlılık irade eksikliği değil, beyin kimyasıdır. Tedavi ile yönetilebilir.',
        clientReactions: [
            { reaction: '"Ben zayıf karakterliyim, başaramam."', response: 'Nikotin bağımlılığı bir beyin hastalığıdır, karakter zayıflığı değil. Beyin kimyanız değişti ve bu tedavi edilebilir.' },
            { reaction: '"Ailemde herkes sigara içiyor, bizim genlerimizde var."', response: 'Genetik yatkınlık olabilir, ama bu kader değildir. Doğru destek ve tedavi ile bağımlılık yönetilebilir.' }
        ],
        therapeuticQuestions: [
            'Bu etiket size kim tarafından verildi?',
            'Hayatınızda irade gösterdiğiniz alanlar var mı?',
            'Bir davranışı tüm kimliğinizi tanımlıyor mu?'
        ],
        copingStrategies: [
            'Davranışı kimlikten ayırın: "İradesiz biri değilim, bu davranışta zorlanıyorum."',
            'Güçlü yönlerinizi listeleyin.',
            'Bağımlılığı tıbbi bir durum olarak kabul edin.'
        ]
    },
    {
        id: 'discounting',
        name: 'Olumluyu Küçümseme',
        description: 'Başarıları görmezden gelme veya önemsizleştirme.',
        smokingExample: '"3 gün dayandım ama o zaten kolaydı, asıl zor olan..."',
        challenge: 'Her gün bir zaferdir. Küçük adımlar büyük değişimlere yol açar.',
        clientReactions: [
            { reaction: '"Sadece 1 hafta oldu, bu bir şey değil."', response: '1 hafta = 140 sigara içmemişsiniz (günde 20 tane hesabıyla). Bu, akciğerlerinize verilen bir hediyedir.' },
            { reaction: '"Kolayı geçti, asıl şimdi zorlaşacak."', response: 'Her gün farklı zorluklar getirir, ama her gün de güçleniyorsunuz. Şu ana kadarki başarınız gerçek bir başarıdır.' }
        ],
        therapeuticQuestions: [
            'Bu başarıyı bir arkadaşınız elde etse ne derdiniz?',
            'Kendinize neden bu kadar sert davranıyorsunuz?',
            'Küçük adımlar olmadan büyük adımlar atılabilir mi?'
        ],
        copingStrategies: [
            'Başarı günlüğü tutun ve düzenli okuyun.',
            'Kendinizi ödüllendirin (biriktiğini paranın bir kısmıyla).',
            'Her sigarasız günü kutlayın.'
        ]
    },
    {
        id: 'emotional_reasoning',
        name: 'Duygusal Akıl Yürütme',
        description: 'Hisleri gerçekmiş gibi kabul etme.',
        smokingExample: '"Sigara içmek istiyorum, demek ki gerçekten ihtiyacım var."',
        challenge: 'İstek duygusu geçicidir. 3-5 dakika bekle, azalacaktır.',
        clientReactions: [
            { reaction: '"Şu an çok istiyorum, demek ki vücudum buna ihtiyaç duyuyor."', response: 'İstek (craving), beynin nikotin arayışıdır. Bu gerçek bir ihtiyaç değil, öğrenilmiş bir tepkidir. 3-5 dakika içinde geçer.' },
            { reaction: '"Sigara içince rahatladığımı hissediyorum."', response: 'Hissettiğiniz rahatlama, yoksunluk belirtilerinin geçici olarak durmasıdır. Sigara sorunu yaratıp sonra çözüyor gibi görünür.' }
        ],
        therapeuticQuestions: [
            'Bu his geçmişte hiç geçti mi?',
            'Hisleriniz her zaman gerçeği yansıtır mı?',
            'Bu isteğe boyun eğmezseniz ne olur?'
        ],
        copingStrategies: [
            'Dalgayı Seyretme (Urge Surfing): İsteği bir dalga gibi izleyin, geçmesini bekleyin.',
            '3 dakika kuralı: Kronometreyi başlatın, genellikle 3 dakikada azalır.',
            'Dikkat dağıtma: Su için, bir tur yürüyün, birini arayın.'
        ]
    },
    {
        id: 'fortune_telling',
        name: 'Falcılık',
        description: 'Geleceği olumsuz olarak tahmin etme.',
        smokingExample: '"Daha önce denedim olmadı, bu sefer de olmayacak."',
        challenge: 'Her deneme farklıdır. Bu sefer farklı araçların ve desteğin var.',
        clientReactions: [
            { reaction: '"5 kez denedim, hep başarısız oldum."', response: 'Ortalama bir kişi 7-10 deneme sonrası başarılı oluyor. Her deneme sizi hedefe yaklaştırıyor ve neyin işe yaramadığını öğretiyor.' },
            { reaction: '"Benim için geç, artık zarar verildi."', response: 'Bırakmanın faydaları dakikalar içinde başlar. 1 yıl sonra kalp krizi riskiniz yarıya iner. Asla geç değildir.' }
        ],
        therapeuticQuestions: [
            'Geleceği kesin olarak bilmek mümkün mü?',
            'Önceki denemelerinizden ne öğrendiniz?',
            'Bu sefer farklı olan ne?'
        ],
        copingStrategies: [
            'Geçmiş deneyimlerden dersler çıkarın.',
            'Bu seferin farklı olduğunu hatırlatın (ilaç desteği, danışmanlık vb.).',
            'Başarı hikayeleri okuyun veya dinleyin.'
        ]
    },
    {
        id: 'should_statements',
        name: 'Zorunluluk Cümleleri',
        description: '"Yapmalıyım, etmeliyim" ile kendine baskı yapma.',
        smokingExample: '"Artık bırakmış olmalıydım, bu yaştan sonra ayıp."',
        challenge: '"Yapmalıyım" yerine "yapmak istiyorum" de. Değişim hazır olduğunda gelir.',
        clientReactions: [
            { reaction: '"Bu yaşta hâlâ içiyorum, utanç verici."', response: 'Bağımlılık yaşla veya zekâyla ilgili değildir. Önemli olan bugün ne yapmak istediğinizdir.' },
            { reaction: '"Çocuklarım için çoktan bırakmış olmalıydım."', response: '"Yapmalıydım" geçmişe takılı kalmanıza neden olur. Önemli olan şu an ve gelecektir. Bugün başlamak her zaman mümkündür.' }
        ],
        therapeuticQuestions: [
            'Bu baskıyı size kim koyuyor?',
            '"Yapmalıyım" yerine "yapmak istiyorum" deseniz nasıl hissederdiniz?',
            'Kendinize karşı daha şefkatli olabilir misiniz?'
        ],
        copingStrategies: [
            'Dil değişikliği: "Yapmalıyım" → "Yapmak istiyorum" veya "Yapabilirim".',
            'Öz-şefkat: Kendinize bir arkadaşınıza davranır gibi davranın.',
            'Şimdiye odaklanın: Geçmiş değiştirilemez, ama şimdi değiştirilebilir.'
        ]
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

// --- DANIŞAN DİRENÇ REHBERİ (CLIENT RESISTANCE GUIDE) ---
export const CBT_CLIENT_RESISTANCE = [
    {
        id: 'only_pleasure',
        category: 'Rasyonalizasyon (Akılcılaştırma)',
        statement: '"Sigara benim tek zevkim, onu da mı elimden alacaksınız?"',
        empatheticResponse: 'Sigaranın sizin için önemli olduğunu anlıyorum. Gerçekten de zor anlarınızda size eşlik etmiş.',
        socraticQuestion: 'Sigara içmeden önce hayatınızda keyif aldığınız şeyler nelerdi? Şu an sigara dışında size mutluluk veren başka şeyler var mı?',
        miTechnique: 'Çelişkiyi Ortaya Çıkarma: "Sigara hem tek zevkiniz hem de sağlığınızı tehdit ediyor. Bu iki gerçek bir arada nasıl hissettiriyor?"',
        alternativePerspective: 'Sigara aslında diğer zevklerinizi de etkiler: Yemeklerin tadı azalır, nefes darlığı aktiviteleri zorlaştırır. Bıraktığınızda yeni zevkler keşfedebilirsiniz.'
    },
    {
        id: 'grandfather',
        category: 'Bağışıklık İllüzyonu',
        statement: '"Dedem 90 yaşına kadar içti, bir şey olmadı."',
        empatheticResponse: 'Dedenizin uzun yaşamış olması güzel bir şey. Ailedeki örnekler bizi etkiler.',
        socraticQuestion: 'Dedeniz sigara içmeseydi belki 100 yaşına kadar yaşar mıydı? Sizce dedenizin şansı herkes için geçerli mi?',
        miTechnique: 'Bilgi Verme (İzinle): "Size bazı istatistikler paylaşabilir miyim? Sigara içenlerin yarısı sigaraya bağlı hastalıklardan ölüyor."',
        alternativePerspective: 'Her bireyin genetiği farklıdır. Ayrıca eskiden tütün daha az kimyasal içeriyordu. Bugünkü sigaralar çok daha zararlı maddeler içeriyor.'
    },
    {
        id: 'tried_failed',
        category: 'Umutsuzluk',
        statement: '"Ben bırakamam, 10 kez denedim olmadı."',
        empatheticResponse: 'Defalarca deneyip başaramamak gerçekten yorucu ve hayal kırıklığı yaratıyor. Bu kadar ısrar etmeniz aslında ne kadar istediğinizi gösteriyor.',
        socraticQuestion: 'Bu 10 denemede size en çok ne yardımcı oldu? Hangi denemede en uzun süre dayanabildiniz ve o dönem neyi farklı yaptınız?',
        miTechnique: 'Öz-Yeterlilik Desteği: "10 kez denemeniz, sigarasız bir hayat istediğinizi gösteriyor. Bu kararlılık önemli bir güç."',
        alternativePerspective: 'Araştırmalar ortalama 7-10 deneme sonrası başarının geldiğini gösteriyor. Her deneme neyin işe yaramadığını öğretiyor. Bu sefer farklı araçlarınız var: ilaç tedavisi, danışmanlık desteği.'
    },
    {
        id: 'one_wont_hurt',
        category: 'Küçümseme / Minimizasyon',
        statement: '"Bir tane bir şey yapmaz, sadece bu seferlik."',
        empatheticResponse: 'İstek anında böyle düşünmek çok doğal. Beyin sizi ikna etmeye çalışıyor.',
        socraticQuestion: '"Sadece bir tane" dedikten sonra genellikle ne oluyor? O bir tane gerçekten sonuncusu mu kalıyor?',
        miTechnique: 'Geçmişi Hatırlatma: "Daha önce \'sadece bir tane\' dediğiniz zamanları düşünün. Sonuçları nasıldı?"',
        alternativePerspective: 'Nikotin bağımlılığında "bir tane" kavramı yoktur. Bir sigara, beyin reseptörlerini yeniden aktive eder ve döngüyü başlatır. İstek dalgası 3-5 dakikada geçer, bekleyin.'
    },
    {
        id: 'weight_gain',
        category: 'Korku / Kaygı',
        statement: '"Bırakırsam kilo alırım, o da sağlıksız."',
        empatheticResponse: 'Kilo alma endişesi çok yaygın ve anlaşılır bir kaygı. Görünümünüz ve sağlığınız sizin için önemli.',
        socraticQuestion: 'Sigara içmeye devam etmenin riskleri ile olası 2-3 kg alımın riskleri karşılaştırılsa hangisi daha ağır basar?',
        miTechnique: 'Bilgi Sunma: "Ortalama kilo alımı 2-4 kg ve bu kontrol edilebilir. 40 sigara içmenin eşdeğeri olan sağlık zararına ulaşmak için 40 kg almanız gerekirdi."',
        alternativePerspective: 'Kilo kontrolü mümkündür: Düzenli egzersiz, sağlıklı atıştırmalıklar. Sigara bırakıldığında metabolizma yavaşlar ama bu geçicidir. İlaç tedavileri kilo alımını azaltabilir.'
    },
    {
        id: 'stress_relief',
        category: 'Yanlış İnanç',
        statement: '"Sigara beni sakinleştiriyor, stresimi alıyor."',
        empatheticResponse: 'Sigara içtiğinizde rahatladığınızı hissetmeniz gerçek bir deneyim. Bu hissi yaşıyorsunuz.',
        socraticQuestion: 'Sigara içmeden önce stresi nasıl yönetiyordunuz? Sigara mı gerçekten stresi çözüyor, yoksa nikotin eksikliğinin yarattığı gerginliği mi gideriyor?',
        miTechnique: 'Çelişkiyi Gösterme: "Sigara sizi sakinleştiriyor diyorsunuz, ama aslında sigara yoksunluğunun yarattığı stresi gideriyor. Sigara içmeyenler bu stresi hiç yaşamıyor."',
        alternativePerspective: 'Nikotin kalp atışını ve kan basıncını artırır - fizyolojik olarak stres yaratır. Hissettiğiniz rahatlama, yoksunluk belirtilerinin geçici olarak durmasıdır. Gerçek rahatlama teknikleri öğrenebilirsiniz.'
    },
    {
        id: 'forced_here',
        category: 'Pasif Direnç',
        statement: '"Ben buraya gelmek istemedim, doktorum/eşim zorladı."',
        empatheticResponse: 'Zorla getirilmek rahatsız edici bir duygudur. Kendi kararınız olmadan burada olmak zor olabilir.',
        socraticQuestion: 'Doktorunuz veya eşiniz neden bunu istemiş olabilir? Sizin için endişelendikleri bir durum var mı?',
        miTechnique: 'Değerlerle Bağlantı: "Eşinizin bu kadar ısrar etmesi sizin için ne ifade ediyor? Aileniz sizin için neyi arzuluyor?"',
        alternativePerspective: 'Başlangıç noktası önemli değil, önemli olan süreçte ne öğrendiğinizdir. Belki de bu görüşme size yeni bir bakış açısı kazandırabilir. Karar her zaman sizin.'
    },
    {
        id: 'enjoy_smoking',
        category: 'Hedonic Direnç',
        statement: '"Ben sigara içmekten keyif alıyorum, bırakmak istemiyorum."',
        empatheticResponse: 'Sigara içmekten keyif aldığınızı söylemeniz önemli. Bu sizin dürüstlüğünüzü gösteriyor.',
        socraticQuestion: 'Günde kaç sigaradan gerçekten keyif alıyorsunuz? Her sigarayı aynı zevkle mi içiyorsunuz, yoksa bazıları sadece alışkanlık mı?',
        miTechnique: 'Ambivalansı Keşfetme: "Sigara içmekle ilgili hoşunuza gitmeyen herhangi bir şey var mı? En ufak bir endişeniz?"',
        alternativePerspective: 'Araştırmalar gösteriyor ki sigara içenlerin %70\'i bırakmak istiyor. Günde içilen 20 sigaranın belki 2-3\'ü "keyif sigarası", geri kalanı yoksunluktan kaçış.'
    }
];

// --- BAŞ ETME TEKNİKLERİ (COPING TECHNIQUES) ---
export const COPING_TECHNIQUES = [
    {
        id: 'four_d',
        name: '4D Tekniği',
        englishName: 'Delay, Distract, Drink water, Deep breathe',
        icon: '⏰',
        description: 'Sigara isteği anında uygulanabilecek 4 adımlı acil müdahale tekniği.',
        steps: [
            { step: 'Delay (Ertele)', instruction: 'Sigara yakmayı 5-10 dakika erteleyin. İstek dalgası genellikle 3-5 dakikada zirve yapar ve düşer.' },
            { step: 'Distract (Dikkat Dağıt)', instruction: 'Dikkatinizi başka bir şeye verin: Kısa bir yürüyüş, birini arayın, bir oyun oynayın.' },
            { step: 'Drink water (Su İç)', instruction: 'Bir bardak su için. Bu hem ağız alışkanlığını hem de eli meşgul eder.' },
            { step: 'Deep breathe (Derin Nefes)', instruction: '4-7-8 nefes tekniği: 4 sn içe çek, 7 sn tut, 8 sn dışa ver. 3 kez tekrarlayın.' }
        ],
        whenToUse: 'Ani ve yoğun sigara isteği duyduğunuzda',
        duration: '5-10 dakika'
    },
    {
        id: 'halt',
        name: 'HALT Kontrolü',
        englishName: 'Hungry, Angry, Lonely, Tired',
        icon: '🛑',
        description: 'Sigara isteğinin arkasındaki gerçek ihtiyacı belirleme tekniği.',
        steps: [
            { step: 'Hungry (Aç mısın?)', instruction: 'Kan şekeri düşüklüğü sinirlilik ve istek yaratır. Sağlıklı bir atıştırmalık deneyin.' },
            { step: 'Angry (Kızgın mısın?)', instruction: 'Öfke sigara isteğini tetikler. Öfkenin kaynağını belirleyin ve ifade edin.' },
            { step: 'Lonely (Yalnız mısın?)', instruction: 'Yalnızlık duygusal boşluk yaratır. Birini arayın veya dışarı çıkın.' },
            { step: 'Tired (Yorgun musun?)', instruction: 'Yorgunluk direnci düşürür. Kısa bir mola verin veya erken yatın.' }
        ],
        whenToUse: 'Sigara isteğinin nedenini anlamak istediğinizde',
        duration: '2-3 dakika (öz-değerlendirme)'
    },
    {
        id: 'urge_surfing',
        name: 'Dalgayı Seyretme (Urge Surfing)',
        englishName: 'Urge Surfing / Mindful Awareness',
        icon: '🌊',
        description: 'İsteği bir dalga gibi izleyerek geçmesini bekleme meditasyonu. İsteği bastırmak yerine kabul etmek.',
        steps: [
            { step: 'Fark Et', instruction: 'Sigara isteğini fark ettiğinizde durun. "Şu an bir istek yaşıyorum" deyin.' },
            { step: 'Gözlemle', instruction: 'İsteğin vücudunuzda nerede hissedildiğini gözlemleyin. Boğaz? Göğüs? Eller?' },
            { step: 'Nefes Al', instruction: 'Derin nefesler alırken isteği bir dalga gibi düşünün - yükseliyor ve düşecek.' },
            { step: 'Bekle', instruction: 'Dalganın zirveye ulaşmasını ve yavaşça düşmesini izleyin. Genellikle 3-5 dakika sürer.' }
        ],
        whenToUse: 'İsteğin yoğun olduğu ve kaçış yolunun olmadığı anlarda',
        duration: '5-10 dakika'
    },
    {
        id: 'grounding_54321',
        name: '5-4-3-2-1 Topraklama (Grounding)',
        englishName: '5-4-3-2-1 Grounding Technique',
        icon: '🌳',
        description: 'Duyuları kullanarak şu ana odaklanma ve anksiyeteyi azaltma tekniği.',
        steps: [
            { step: '5 Şey GÖR', instruction: 'Etrafınızda görebildiğiniz 5 şeyi adlandırın (örn: masa, kalem, pencere...)' },
            { step: '4 Şey DOKUN', instruction: 'Dokunabildiğiniz 4 şeyi hissedin (örn: kumaş, klavye, yüzey...)' },
            { step: '3 Şey DUYUN', instruction: 'Duyabildiğiniz 3 sesi fark edin (örn: trafik, klima, kuş sesi...)' },
            { step: '2 Şey KOKLAYUN', instruction: 'Koklayabildiğiniz 2 kokuyu belirleyin (örn: kahve, sabun...)' },
            { step: '1 Şey TADIN', instruction: 'Ağzınızdaki bir tadı fark edin veya bir nane/sakız çiğneyin' }
        ],
        whenToUse: 'Panik, anksiyete veya yoğun istek anlarında şu ana dönmek için',
        duration: '3-5 dakika'
    },
    {
        id: 'thought_stopping',
        name: 'Düşünce Durdurma (STOP Tekniği)',
        englishName: 'Thought Stopping / STOP Technique',
        icon: '✋',
        description: 'Olumsuz düşünce döngüsünü kırmak için bilişsel kesintiye uğratma tekniği.',
        steps: [
            { step: 'S - Stop (Dur)', instruction: 'Kendinize yüksek sesle veya içinizden "DUR!" deyin. Düşünce akışını kesin.' },
            { step: 'T - Take a breath (Nefes Al)', instruction: 'Derin bir nefes alın. Bu, beyne duraklama sinyali gönderir.' },
            { step: 'O - Observe (Gözlemle)', instruction: 'Düşüncenizi dışarıdan gözlemleyin. "Şu an sigara düşüncesi yaşıyorum" deyin.' },
            { step: 'P - Proceed (Devam Et)', instruction: 'Bilinçli bir alternatif seçin. Ne yapmak İSTİYORSUNUZ?' }
        ],
        whenToUse: 'Obsesif sigara düşünceleri veya ruminasyon anlarında',
        duration: '1-2 dakika'
    },
    {
        id: 'progressive_relaxation',
        name: 'Kademeli Kas Gevşetme',
        englishName: 'Progressive Muscle Relaxation (PMR)',
        icon: '💆',
        description: 'Kas gruplarını sırayla gerip gevşeterek fiziksel ve zihinsel gerilimi azaltma tekniği.',
        steps: [
            { step: 'Hazırlık', instruction: 'Rahat bir pozisyonda oturun veya uzanın. Gözlerinizi kapatın.' },
            { step: 'Eller ve Kollar', instruction: 'Yumruklarınızı 5 saniye sıkın, sonra 10 saniye gevşetin. Aradaki farkı hissedin.' },
            { step: 'Omuzlar ve Boyun', instruction: 'Omuzlarınızı kulaklarınıza doğru 5 saniye kaldırın, sonra bırakın.' },
            { step: 'Yüz', instruction: 'Yüz kaslarınızı (alın, çene) 5 saniye gerin, sonra gevşetin.' },
            { step: 'Bacaklar', instruction: 'Ayak parmaklarınızı 5 saniye sıkın, sonra tüm bacağı gevşetin.' }
        ],
        whenToUse: 'Stres ve gerginlik hissettiğinizde, özellikle yoksunluk döneminde',
        duration: '10-15 dakika'
    },
    {
        id: 'visualization',
        name: 'Görselleştirme (İmgeleme)',
        englishName: 'Visualization / Guided Imagery',
        icon: '🧘',
        description: 'Olumlu bir gelecek veya sakinleştirici bir mekan hayal ederek rahatlamayı sağlayan teknik.',
        steps: [
            { step: 'Rahat Pozisyon', instruction: 'Gözlerinizi kapatın ve derin nefesler alın.' },
            { step: 'Güvenli Yer', instruction: 'Kendinizi sakin, güvenli bir yerde hayal edin (deniz kenarı, orman, bahçe...)' },
            { step: 'Duyuları Dahil Edin', instruction: 'O yerdeki sesleri, kokuları, sıcaklığı hayal edin.' },
            { step: 'Sigarasız Gelecek', instruction: 'Kendinizi 1 yıl sonra sigarasız, sağlıklı ve özgür hayal edin. Nasıl hissediyorsunuz?' }
        ],
        whenToUse: 'Motivasyonu artırmak veya rahatlamak için',
        duration: '5-10 dakika'
    },
    {
        id: 'cost_benefit',
        name: 'Maliyet-Fayda Analizi',
        englishName: 'Cost-Benefit Analysis',
        icon: '⚖️',
        description: 'Sigara içmenin ve bırakmanın artı/eksilerini yazılı olarak değerlendirme tekniği.',
        steps: [
            { step: 'Kağıt-Kalem', instruction: 'Bir kağıdı 4 bölüme ayırın.' },
            { step: 'İçmenin Faydaları', instruction: 'Sol üst: Sigara içmenin size sağladığı faydaları yazın.' },
            { step: 'İçmenin Zararları', instruction: 'Sol alt: Sigara içmenin zararlarını yazın.' },
            { step: 'Bırakmanın Faydaları', instruction: 'Sağ üst: Bırakmanın sağlayacağı faydaları yazın.' },
            { step: 'Değerlendirme', instruction: 'Her maddeye 1-10 arası önem puanı verin. Toplamları karşılaştırın.' }
        ],
        whenToUse: 'Kararsızlık anlarında veya motivasyon düştüğünde',
        duration: '15-20 dakika'
    }
];

