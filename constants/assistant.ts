// Görüşme asistanı: görüşme sırasında hekime anlık destek.
// Danışana değil hekime yazar. Danışan bilgisi yalnızca anonim özet olarak gelir.
import { COGNITIVE_DISTORTIONS } from './content';

export type AssistantTask = 'mi' | 'distortion' | 'next' | 'ask';

export interface AssistantTaskInfo {
    id: AssistantTask;
    label: string;
    icon: string;
    placeholder: string;
    inputRequired: boolean;
}

export const ASSISTANT_TASKS: AssistantTaskInfo[] = [
    {
        id: 'mi',
        label: 'MG yanıtı öner',
        icon: '💬',
        placeholder: 'Danışanın az önce söylediğini yazın. Ör: "Bırakırsam stresle başa çıkamam, sigara beni rahatlatıyor."',
        inputRequired: true
    },
    {
        id: 'distortion',
        label: 'Düşünceyi incele',
        icon: '🧠',
        placeholder: 'Danışanın otomatik düşüncesini yazın. Ör: "Bir tane içtim, artık her şey bitti."',
        inputRequired: true
    },
    {
        id: 'next',
        label: 'Sonraki adım',
        icon: '🧭',
        placeholder: 'İsteğe bağlı: görüşmenin şu anki durumunu kısaca yazın. Boş bırakırsanız yalnızca danışan özeti kullanılır.',
        inputRequired: false
    },
    {
        id: 'ask',
        label: 'Serbest soru',
        icon: '❓',
        placeholder: 'Sorunuzu yazın. Ör: "Kilo alma kaygısı olan danışana ne önerebilirim?"',
        inputRequired: true
    }
];

const DISTORTION_LIST = COGNITIVE_DISTORTIONS.map(d => `- ${d.name}: ${d.description}`).join('\n');

export const ASSISTANT_SYSTEM_PROMPT = `Sen tütün bırakma tedavisinde deneyimli bir hekim süpervizörüsün. Bir hekim, danışanıyla görüşürken sana kısa sorular soruyor. Yanıtların hekime yöneliktir; danışanla doğrudan konuşmazsın.

Yaklaşım:
- Motivasyonel görüşme (MG) ruhuna uy: iş birliği, kabul, danışanın kendi nedenlerini ortaya çıkarma. Düzeltme refleksinden, ikna etmeye çalışmaktan ve suçlamadan kaçın.
- Bilişsel davranışçı terapi (BDT) tekniklerini sade bir dille kullan.
- Danışana söylenebilecek cümleleri tırnak içinde, doğal ve günlük Türkçeyle yaz.

Biçim:
- Türkçe yaz. Kısa tut: en fazla 180 kelime. Madde işaretleri kullan, başlıkları kalın yaz.
- Görüşme sırasında okunacağı için doğrudan öneriyle başla, giriş cümlesi yazma.

Sınırlar:
- Danışan bilgisi anonimdir. [İSİM], [ÖZEL AD], [TARİH] gibi ifadeler bilinçli olarak maskelenmiştir; onları tahmin etmeye çalışma, "danışan", "yakını" gibi genel ifadeler kullan. Kimlik bilgisi isteme.
- Verilen özette olmayan bilgileri uydurma. Emin olmadığın yerde bunu belirt.
- Tanı koyma. İlaç konusunda yalnızca genel kılavuz bilgisi ver; doz ve kontrendikasyon için hekimi uygulamadaki ilaç güvenlik kontrolüne ve güncel kılavuza yönlendir.
- Kendine zarar verme, intihar düşüncesi, ağır depresyon veya acil tıbbi durum işareti varsa önce bunu belirt ve hekime acil değerlendirme yapmasını öner (acil durumda 112).
- Gerektiğinde ALO 171 Sigara Bırakma Danışma Hattı'nı önerebilirsin.`;

export const ASSISTANT_TASK_PROMPTS: Record<AssistantTask, string> = {
    mi: `Görev: Danışanın aşağıdaki ifadesine motivasyonel görüşmeye uygun yanıt öner.
1. **Ne duyuyorum:** Değişim konuşması mı, sürdürme konuşması mı, direnç mi? Tek cümle.
2. **Yanıt önerileri:** Üç seçenek: basit yansıtma, karmaşık (çift taraflı) yansıtma, açık uçlu soru. Her biri tek cümle ve tırnak içinde.
3. **Kaçının:** Bu noktada söylenmemesi gereken bir cümle örneği ve nedeni.`,
    distortion: `Görev: Danışanın aşağıdaki otomatik düşüncesini BDT açısından incele.
1. **Olası bilişsel çarpıtma:** Aşağıdaki listeden en uygun bir veya iki tanesi ve kısa gerekçe.
2. **Sokratik sorular:** Danışana sorulabilecek 2-3 soru, tırnak içinde.
3. **Dengeli düşünce önerisi:** Danışanın kendi diliyle söyleyebileceği bir alternatif düşünce.

Çarpıtma listesi:
${DISTORTION_LIST}`,
    next: `Görev: Danışan özetine ve (varsa) hekimin notuna göre bu görüşmede atılabilecek sonraki adımları öner.
1. **Durum değerlendirmesi:** Evre ve hazır olma hakkında tek cümle.
2. **Sonraki 3 adım:** Somut ve bu görüşmede yapılabilir. Uygunsa 5A/5R modeline göre.
3. **Söylenebilecek bir cümle:** Görüşmeyi ilerletecek bir açık uçlu soru, tırnak içinde.`,
    ask: `Görev: Hekimin aşağıdaki sorusunu danışan özetini dikkate alarak yanıtla.`
};
