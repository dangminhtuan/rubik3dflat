// Thư viện công thức học chơi Rubik & chế độ chạy mẫu từng bước
import { i18n } from './i18n.js';

const FORMULA_I18N = {
  "sexy-move": {
    "sequence": [
      "R",
      "U",
      "R'",
      "U'"
    ],
    "vi": {
      "name": "Sexy Move (Kinh điển)",
      "stage": "Cơ bản",
      "description": "Công thức nền tảng quan trọng nhất của Rubik. Lặp lại 6 lần sẽ đưa khối Rubik về nguyên trạng!"
    },
    "en": {
      "name": "Sexy Move (Classic)",
      "stage": "Basic",
      "description": "The most fundamental Rubik's formula. Repeating 6 times returns the cube to its original state!"
    },
    "ja": {
      "name": "セクシームーブ (基本)",
      "stage": "基礎",
      "description": "最も基本となる公式。6回繰り返すと元の状態に戻ります！"
    },
    "zh": {
      "name": "基础手法 Sexy Move",
      "stage": "基础",
      "description": "魔方最重要的基础手法。重复6次即可恢复原状！"
    },
    "es": {
      "name": "Sexy Move (Clásico)",
      "stage": "Básico",
      "description": "¡La fórmula más fundamental del Cubo. Repetir 6 veces devuelve el cubo a su estado original!"
    },
    "fr": {
      "name": "Sexy Move (Classique)",
      "stage": "Base",
      "description": "La formule la plus fondamentale du Rubik's Cube. Répéter 6 fois remet le cube dans son état initial !"
    },
    "de": {
      "name": "Sexy Move (Klassisch)",
      "stage": "Basis",
      "description": "Die grundlegendste Zauberwürfel-Formel. 6 Wiederholungen bringen den Würfel in den Urzustand zurück!"
    },
    "ru": {
      "name": "Пиф-паф (Классика)",
      "stage": "База",
      "description": "Самый базовый алгоритм кубика. Повторение 6 раз возвращает кубик в исходное состояние!"
    },
    "pt": {
      "name": "Sexy Move (Clássico)",
      "stage": "Básico",
      "description": "A fórmula mais fundamental do cubo. Repetir 6 vezes retorna o cubo ao estado original!"
    },
    "ko": {
      "name": "섹시 무브 (기본)",
      "stage": "기초",
      "description": "가장 핵심적인 큐브 공식입니다. 6번 반복하면 원래 상태로 돌아옵니다!"
    },
    "it": {
      "name": "Sexy Move (Classico)",
      "stage": "Base",
      "description": "La formula più fondamentale del cubo. Ripetuta 6 volte riporta il cubo allo stato iniziale!"
    },
    "ar": {
      "name": "سيكسي موف (كلاسيكي)",
      "stage": "أساسي",
      "description": "أهم صيغة أساسية في مكعب روبيك. تكرارها 6 مرات يعيد المكعب لوضعه الأصلي!"
    },
    "hi": {
      "name": "सेक्सी मूव (क्लासिक)",
      "stage": "बेसिक",
      "description": "रूबिक का सबसे बुनियादी सूत्र। 6 बार दोहराने पर क्यूब मूल स्थिति में लौट आता है!"
    },
    "id": {
      "name": "Sexy Move (Klasik)",
      "stage": "Dasar",
      "description": "Rumus paling mendasar dari Rubik. Diulang 6 kali akan mengembalikan kubus ke kondisi semula!"
    },
    "tr": {
      "name": "Sexy Move (Klasik)",
      "stage": "Temel",
      "description": "Rubik küpünün en temel formülü. 6 kez tekrarlandığında küpü orijinal haline döndürür!"
    }
  },
  "rev-sexy": {
    "sequence": [
      "U",
      "R",
      "U'",
      "R'"
    ],
    "vi": {
      "name": "Reverse Sexy Move",
      "stage": "Cơ bản",
      "description": "Nghịch đảo của Sexy Move, dùng rất nhiều trong giải góc và tầng 1."
    },
    "en": {
      "name": "Reverse Sexy Move",
      "stage": "Basic",
      "description": "Inverse of the Sexy Move, widely used for corners and layer 1."
    },
    "ja": {
      "name": "逆セクシームーブ",
      "stage": "基礎",
      "description": "セクシームーブの逆手順。第1層のコーナー解法に多用されます。"
    },
    "zh": {
      "name": "逆向手法 Reverse Sexy",
      "stage": "基础",
      "description": "Sexy Move的逆向公式，广泛用于第1层角块复原。"
    },
    "es": {
      "name": "Reverse Sexy Move",
      "stage": "Básico",
      "description": "Inverso del Sexy Move, muy usado en esquinas y primera capa."
    },
    "fr": {
      "name": "Sexy Move Inversé",
      "stage": "Base",
      "description": "L'inverse du Sexy Move, très utilisé pour les coins et le premier étage."
    },
    "de": {
      "name": "Inverser Sexy Move",
      "stage": "Basis",
      "description": "Das Inverse des Sexy Move, häufig verwendet für Ecken und die 1. Ebene."
    },
    "ru": {
      "name": "Обратный пиф-паф",
      "stage": "База",
      "description": "Обратный алгоритм пиф-пафа, часто используется для углов и 1-го слоя."
    },
    "pt": {
      "name": "Sexy Move Invertido",
      "stage": "Básico",
      "description": "O inverso do Sexy Move, muito usado para cantos e 1ª camada."
    },
    "ko": {
      "name": "역 섹시 무브",
      "stage": "기초",
      "description": "섹시 무브의 역방향 절차로 1층 코너를 맞출 때 자주 사용됩니다."
    },
    "it": {
      "name": "Sexy Move Inverso",
      "stage": "Base",
      "description": "L'inverso del Sexy Move, molto usato per angoli e 1° strato."
    },
    "ar": {
      "name": "سيكسي موف معكوس",
      "stage": "أساسي",
      "description": "معكوس صيغة سيكسي موف، يُستخدم كثيراً في زوايا الطبقة الأولى."
    },
    "hi": {
      "name": "उल्टा सेक्सी मूव",
      "stage": "बेसिक",
      "description": "सेक्सी मूव का उलटा रूप, कोनों और पहली परत के लिए व्यापक रूप से उपयोगी।"
    },
    "id": {
      "name": "Reverse Sexy Move",
      "stage": "Dasar",
      "description": "Kebalikan dari Sexy Move, banyak digunakan untuk sudut dan lapisan 1."
    },
    "tr": {
      "name": "Ters Sexy Move",
      "stage": "Temel",
      "description": "Sexy Move'un tersidir, köşeler ve 1. katman için sıkça kullanılır."
    }
  },
  "yellow-cross": {
    "sequence": [
      "F",
      "R",
      "U",
      "R'",
      "U'",
      "F'"
    ],
    "vi": {
      "name": "Tạo dấu cộng vàng (F R U R' U' F')",
      "stage": "Tầng 3",
      "description": "Chuyển đổi các hình chữ L, đường thẳng vàng trên đỉnh thành dấu cộng vàng."
    },
    "en": {
      "name": "Yellow Cross (F R U R' U' F')",
      "stage": "Layer 3",
      "description": "Transforms dot, L-shape, or line on top into a yellow cross."
    },
    "ja": {
      "name": "黄色クロス (F R U R' U' F')",
      "stage": "第3層",
      "description": "上面の点・逆L字・一文字を黄色十字に変換します。"
    },
    "zh": {
      "name": "顶部黄色十字 (F R U R' U' F')",
      "stage": "第3层",
      "description": "将顶层的点、拐角或一字线转换为黄色十字。"
    },
    "es": {
      "name": "Cruz Amarilla (F R U R' U' F')",
      "stage": "Capa 3",
      "description": "Transforma punto, L o línea en cruz amarilla superior."
    },
    "fr": {
      "name": "Croix Jaune (F R U R' U' F')",
      "stage": "Étage 3",
      "description": "Transforme le point, le L inversé ou la ligne en croix jaune supérieure."
    },
    "de": {
      "name": "Gelbes Kreuz (F R U R' U' F')",
      "stage": "Ebene 3",
      "description": "Verwandelt Punkt, umgekehrtes L oder Linie in ein gelbes Kreuz."
    },
    "ru": {
      "name": "Желтый крест (F R U R' U' F')",
      "stage": "3-й слой",
      "description": "Превращает точку, уголок или линию в желтый крест на шапке."
    },
    "pt": {
      "name": "Cruz Amarela (F R U R' U' F')",
      "stage": "Camada 3",
      "description": "Transforma ponto, L invertido ou linha em uma cruz amarela no topo."
    },
    "ko": {
      "name": "노란 십자가 (F R U R' U' F')",
      "stage": "3층",
      "description": "윗면의 점, 역L자, 일자 모양을 노란 십자가로 변환합니다."
    },
    "it": {
      "name": "Croce Gialla (F R U R' U' F')",
      "stage": "3° Strato",
      "description": "Trasforma punto, L invertita o linea in una croce gialla superiore."
    },
    "ar": {
      "name": "الصليب الأصفر (F R U R' U' F')",
      "stage": "الطبقة 3",
      "description": "يحول النقطة أو شكل L أو الخط إلى صليب أصفر في الأعلى."
    },
    "hi": {
      "name": "पीला क्रॉस (F R U R' U' F')",
      "stage": "परत 3",
      "description": "शीर्ष पर बिंदु, उल्टे L या रेखा को पीले क्रॉस में बदलता है।"
    },
    "id": {
      "name": "Salib Kuning (F R U R' U' F')",
      "stage": "Lapisan 3",
      "description": "Mengubah titik, bentuk L, atau garis di atas menjadi salib kuning."
    },
    "tr": {
      "name": "Sarı Artı (F R U R' U' F')",
      "stage": "Katman 3",
      "description": "Üstteki nokta, ters L veya düz çizgiyi sarı artıya dönüştürür."
    }
  },
  "sune": {
    "sequence": [
      "R",
      "U",
      "R'",
      "U",
      "R",
      "U2",
      "R'"
    ],
    "vi": {
      "name": "Sune (Lật 3 góc vàng)",
      "stage": "Tầng 3",
      "description": "Công thức huyền thoại OLL giúp định hướng toàn bộ mặt vàng lên trên."
    },
    "en": {
      "name": "Sune (Orient 3 Corners)",
      "stage": "Layer 3",
      "description": "Legendary OLL formula that orients yellow corners face up."
    },
    "ja": {
      "name": "スネ (Sune / 3コーナー反転)",
      "stage": "第3層",
      "description": "上面の黄色コーナーを一気に上向きに揃える定番公式。"
    },
    "zh": {
      "name": "小鱼公式 Sune",
      "stage": "第3层",
      "description": "经典OLL公式，用于快速翻转顶层黄色角块朝上。"
    },
    "es": {
      "name": "Sune (Orientar 3 esquinas)",
      "stage": "Capa 3",
      "description": "Fórmula clásica de OLL para orientar las esquinas amarillas hacia arriba."
    },
    "fr": {
      "name": "Sune (Orienter 3 coins)",
      "stage": "Étage 3",
      "description": "Formule légendaire d'OLL pour orienter les coins jaunes vers le haut."
    },
    "de": {
      "name": "Sune (3 Ecken ausrichten)",
      "stage": "Ebene 3",
      "description": "Legendäre OLL-Formel zum Ausrichten der gelben Ecken nach oben."
    },
    "ru": {
      "name": "Рыбка Sune (Ориентация углов)",
      "stage": "3-й слой",
      "description": "Легендарная формула OLL для разворота желтых углов наверх."
    },
    "pt": {
      "name": "Sune (Orientar 3 cantos)",
      "stage": "Camada 3",
      "description": "Fórmula lendária de OLL para orientar os cantos amarelos para cima."
    },
    "ko": {
      "name": "슌 Sune (3개 코너 방향)",
      "stage": "3층",
      "description": "윗면의 노란색 코너를 한 번에 위로 향하게 맞추는 대표 OLL 공식."
    },
    "it": {
      "name": "Sune (Orienta 3 angoli)",
      "stage": "3° Strato",
      "description": "Leggendaria formula OLL per orientare gli angoli gialli verso l'alto."
    },
    "ar": {
      "name": "سوني (توجيه 3 زوايا)",
      "stage": "الطبقة 3",
      "description": "صيغة OLL الأسطورية لتوجيه الزوايا الصفراء نحو الأعلى."
    },
    "hi": {
      "name": "सूने (3 कोनों का उन्मुखीकरण)",
      "stage": "परत 3",
      "description": "प्रसिद्ध OLL सूत्र जो पीले कोनों को ऊपर की ओर उन्मुख करता है।"
    },
    "id": {
      "name": "Sune (Orientasi 3 Sudut)",
      "stage": "Lapisan 3",
      "description": "Rumus OLL legendaris untuk menghadapkan sudut kuning ke atas."
    },
    "tr": {
      "name": "Sune (3 Köşeyi Yönlendirme)",
      "stage": "Katman 3",
      "description": "Sarı köşeleri yukarı baktıran efsanevi OLL formülü."
    }
  },
  "anti-sune": {
    "sequence": [
      "R",
      "U2",
      "R'",
      "U'",
      "R",
      "U'",
      "R'"
    ],
    "vi": {
      "name": "Anti-Sune (Nghịch đảo Sune)",
      "stage": "Tầng 3",
      "description": "Đối xứng với Sune, lật góc vàng ngược chiều kim đồng hồ."
    },
    "en": {
      "name": "Anti-Sune (Sune Mirror)",
      "stage": "Layer 3",
      "description": "Mirror of Sune, rotates yellow corners counter-clockwise."
    },
    "ja": {
      "name": "アンチスネ (Anti-Sune)",
      "stage": "第3層",
      "description": "スネの鏡像手順。コーナーを反時計回りに反転させます。"
    },
    "zh": {
      "name": "逆小鱼 Anti-Sune",
      "stage": "第3层",
      "description": "Sune的对称镜像公式，逆时针翻转顶层角块。"
    },
    "es": {
      "name": "Anti-Sune (Espejo de Sune)",
      "stage": "Capa 3",
      "description": "Espejo de Sune, rota esquinas amarillas en sentido antihorario."
    },
    "fr": {
      "name": "Anti-Sune (Miroir de Sune)",
      "stage": "Étage 3",
      "description": "Miroir de Sune, fait pivoter les coins dans le sens antihoraire."
    },
    "de": {
      "name": "Anti-Sune (Spiegel von Sune)",
      "stage": "Ebene 3",
      "description": "Spiegelung von Sune, dreht gelbe Ecken gegen den Uhrzeigersinn."
    },
    "ru": {
      "name": "Анти-рыбка (Anti-Sune)",
      "stage": "3-й слой",
      "description": "Зеркальный вариант Sune, поворачивает углы против часовой стрелки."
    },
    "pt": {
      "name": "Anti-Sune (Espelho de Sune)",
      "stage": "Camada 3",
      "description": "Espelho de Sune, rotaciona cantos amarelos no sentido anti-horário."
    },
    "ko": {
      "name": "안티 슌 (Anti-Sune)",
      "stage": "3층",
      "description": "슌의 대칭 절차로 코너를 반시계 방향으로 회전시킵니다."
    },
    "it": {
      "name": "Anti-Sune (Specchio di Sune)",
      "stage": "3° Strato",
      "description": "Speculare di Sune, ruota gli angoli in senso antiorario."
    },
    "ar": {
      "name": "أنتي سوني (مرآة سوني)",
      "stage": "الطبقة 3",
      "description": "مرآة صيغة سوني، لتدوير الزوايا الصفراء عكس عقارب الساعة."
    },
    "hi": {
      "name": "एंटी-सूने (सूने का दर्पण)",
      "stage": "परत 3",
      "description": "सूने का सममित रूप, पीले कोनों को वामावर्त घुमाता है।"
    },
    "id": {
      "name": "Anti-Sune (Cermin Sune)",
      "stage": "Lapisan 3",
      "description": "Cermin dari Sune, memutar sudut kuning berlawanan jarum jam."
    },
    "tr": {
      "name": "Anti-Sune (Sune Aynası)",
      "stage": "Katman 3",
      "description": "Sune'nin simetriğidir, sarı köşeleri saat yönü tersine döndürür."
    }
  },
  "f2l-right": {
    "sequence": [
      "U",
      "R",
      "U'",
      "R'",
      "U'",
      "F'",
      "U",
      "F"
    ],
    "vi": {
      "name": "Ghép cạnh vào bên phải (Tầng 2)",
      "stage": "Tầng 2",
      "description": "Đưa viên cạnh từ tầng 3 vào đúng vị trí giữa tầng 2 bên phải."
    },
    "en": {
      "name": "Insert Edge Right (Layer 2)",
      "stage": "Layer 2",
      "description": "Inserts top edge into middle right slot."
    },
    "ja": {
      "name": "エッジ右挿入 (第2層)",
      "stage": "第2層",
      "description": "上層のエッジを第2層の右スロットに収めます。"
    },
    "zh": {
      "name": "中层右侧棱块归位",
      "stage": "第2层",
      "description": "将顶层棱块精准归位到中层右侧插槽。"
    },
    "es": {
      "name": "Insertar arista a la derecha (Capa 2)",
      "stage": "Capa 2",
      "description": "Inserta la arista superior en la ranura derecha de la capa media."
    },
    "fr": {
      "name": "Insérer arête à droite (Étage 2)",
      "stage": "Étage 2",
      "description": "Insère l'arête supérieure dans l'emplacement droit de la couche moyenne."
    },
    "de": {
      "name": "Kante rechts einfügen (Ebene 2)",
      "stage": "Ebene 2",
      "description": "Fügt die obere Kante in den mittleren rechten Schlitz ein."
    },
    "ru": {
      "name": "Вставка ребра вправо (2-й слой)",
      "stage": "2-й слой",
      "description": "Устанавливает верхнее ребро в правый слот среднего слоя."
    },
    "pt": {
      "name": "Inserir meio à direita (Camada 2)",
      "stage": "Camada 2",
      "description": "Insere o meio superior na fenda direita da camada central."
    },
    "ko": {
      "name": "우측 엣지 삽입 (2층)",
      "stage": "2층",
      "description": "3층의 엣지를 2층 우측 슬롯에 정확하게 끼워 넣습니다."
    },
    "it": {
      "name": "Inserimento spigolo a destra (2° strato)",
      "stage": "2° Strato",
      "description": "Inserisce lo spigolo superiore nello slot destro dello strato intermedio."
    },
    "ar": {
      "name": "إدخال الحافة إلى اليمين (الطبقة 2)",
      "stage": "الطبقة 2",
      "description": "يدخل الحافة العلوية في الموضع الأيمن من الطبقة الوسطى."
    },
    "hi": {
      "name": "दायां किनारा डालें (परत 2)",
      "stage": "परत 2",
      "description": "शीर्ष किनारे को मध्य परत के दाएं स्लॉट में स्थापित करता है।"
    },
    "id": {
      "name": "Sisipkan Tepi Kanan (Lapisan 2)",
      "stage": "Lapisan 2",
      "description": "Menyisipkan tepi atas ke slot kanan lapisan tengah."
    },
    "tr": {
      "name": "Sağa Kenar Yerleştirme (Katman 2)",
      "stage": "Katman 2",
      "description": "Üst kenarı orta katmanın sağ yuvasına yerleştirir."
    }
  },
  "f2l-left": {
    "sequence": [
      "U'",
      "L'",
      "U",
      "L",
      "U",
      "F",
      "U'",
      "F'"
    ],
    "vi": {
      "name": "Ghép cạnh vào bên trái (Tầng 2)",
      "stage": "Tầng 2",
      "description": "Đưa viên cạnh từ tầng 3 vào đúng vị trí giữa tầng 2 bên trái."
    },
    "en": {
      "name": "Insert Edge Left (Layer 2)",
      "stage": "Layer 2",
      "description": "Inserts top edge into middle left slot."
    },
    "ja": {
      "name": "エッジ左挿入 (第2層)",
      "stage": "第2層",
      "description": "上層のエッジを第2層の左スロットに収めます。"
    },
    "zh": {
      "name": "中层左侧棱块归位",
      "stage": "第2层",
      "description": "将顶层棱块精准归位到中层左侧插槽。"
    },
    "es": {
      "name": "Insertar arista a la izquierda (Capa 2)",
      "stage": "Capa 2",
      "description": "Inserta la arista superior en la ranura izquierda de la capa media."
    },
    "fr": {
      "name": "Insérer arête à gauche (Étage 2)",
      "stage": "Étage 2",
      "description": "Insère l'arête supérieure dans l'emplacement gauche de la couche moyenne."
    },
    "de": {
      "name": "Kante links einfügen (Ebene 2)",
      "stage": "Ebene 2",
      "description": "Fügt die obere Kante in den mittleren linken Schlitz ein."
    },
    "ru": {
      "name": "Вставка ребра влево (2-й слой)",
      "stage": "2-й слой",
      "description": "Устанавливает верхнее ребро в левый слот среднего слоя."
    },
    "pt": {
      "name": "Inserir meio à esquerda (Camada 2)",
      "stage": "Camada 2",
      "description": "Insere o meio superior na fenda esquerda da camada central."
    },
    "ko": {
      "name": "좌측 엣지 삽입 (2층)",
      "stage": "2층",
      "description": "3층의 엣지를 2층 좌측 슬롯에 정확하게 끼워 넣습니다."
    },
    "it": {
      "name": "Inserimento spigolo a sinistra (2° strato)",
      "stage": "2° Strato",
      "description": "Inserisce lo spigolo superiore nello slot sinistro dello strato intermedio."
    },
    "ar": {
      "name": "إدخال الحافة إلى اليسار (الطبقة 2)",
      "stage": "الطبقة 2",
      "description": "يدخل الحافة العلوية في الموضع الأيسر من الطبقة الوسطى."
    },
    "hi": {
      "name": "बायां किनारा डालें (परत 2)",
      "stage": "परत 2",
      "description": "शीर्ष किनारे को मध्य परत के बाएं स्लॉट में स्थापित करता है।"
    },
    "id": {
      "name": "Sisipkan Tepi Kiri (Lapisan 2)",
      "stage": "Lapisan 2",
      "description": "Menyisipkan tepi atas ke slot kiri lapisan tengah."
    },
    "tr": {
      "name": "Sola Kenar Yerleştirme (Katman 2)",
      "stage": "Katman 2",
      "description": "Üst kenarı orta katmanın sol yuvasına yerleştirir."
    }
  },
  "niklas": {
    "sequence": [
      "U",
      "R",
      "U'",
      "L'",
      "U",
      "R'",
      "U'",
      "L"
    ],
    "vi": {
      "name": "Niklas (Định vị 4 góc đỉnh)",
      "stage": "Tầng 3",
      "description": "Hoán vị 3 góc tầng 3 khi giữ nguyên 1 góc đúng ở trước-phải."
    },
    "en": {
      "name": "Niklas (Position 4 Top Corners)",
      "stage": "Layer 3",
      "description": "Permutes 3 top corners while keeping front-right intact."
    },
    "ja": {
      "name": "ニクラス (4コーナー位置合わせ)",
      "stage": "第3層",
      "description": "手前右の正しいコーナーを固定し、残り3コーナーを循環置換します。"
    },
    "zh": {
      "name": "Niklas 角块对齐公式",
      "stage": "第3层",
      "description": "保持右前角块不变，循环置换顶层其余三个角块位置。"
    },
    "es": {
      "name": "Niklas (Posicionar 4 esquinas)",
      "stage": "Capa 3",
      "description": "Permuta 3 esquinas superiores manteniendo fija la frontal-derecha."
    },
    "fr": {
      "name": "Niklas (Positionner 4 coins)",
      "stage": "Étage 3",
      "description": "Permute 3 coins supérieurs en gardant le coin avant-droit intact."
    },
    "de": {
      "name": "Niklas (4 Ecken positionieren)",
      "stage": "Ebene 3",
      "description": "Tauscht 3 obere Ecken, während die vordere rechte Ecke erhalten bleibt."
    },
    "ru": {
      "name": "Формула Niklas (Расстановка углов)",
      "stage": "3-й слой",
      "description": "Циклически меняет 3 верхних угла, сохраняя угол спереди-справа."
    },
    "pt": {
      "name": "Niklas (Posicionar 4 cantos)",
      "stage": "Camada 3",
      "description": "Permuta 3 cantos superiores mantendo o da frente-direita fixo."
    },
    "ko": {
      "name": "니클라스 (4개 코너 위치 맞추기)",
      "stage": "3층",
      "description": "앞면 우측의 올바른 코너를 고정하고 나머지 3개 코너를 순환 교환합니다."
    },
    "it": {
      "name": "Niklas (Posiziona 4 angoli)",
      "stage": "3° Strato",
      "description": "Permuta 3 angoli superiori mantenendo fermo l'angolo anteriore-destro."
    },
    "ar": {
      "name": "نيكلاس (تحديد مواقع 4 زوايا)",
      "stage": "الطبقة 3",
      "description": "يبدل 3 زوايا علوية مع الحفاظ على الزاوية الأمامية اليمنى ثابتة."
    },
    "hi": {
      "name": "निकलास (4 शीर्ष कोनों का स्थान)",
      "stage": "परत 3",
      "description": "आगे-दाएं कोने को सही रखते हुए अन्य 3 शीर्ष कोनों को बदलता है।"
    },
    "id": {
      "name": "Niklas (Posisi 4 Sudut Atas)",
      "stage": "Lapisan 3",
      "description": "Memutarkan 3 sudut atas sambil mempertahankan sudut depan-kanan."
    },
    "tr": {
      "name": "Niklas (4 Köşeyi Konumlandırma)",
      "stage": "Katman 3",
      "description": "Ön-sağdaki doğru köşeyi sabit tutarak diğer 3 köşeyi yer değiştirir."
    }
  },
  "orient-corner": {
    "sequence": [
      "R'",
      "D'",
      "R",
      "D"
    ],
    "vi": {
      "name": "Lật góc vàng (R' D' R D)",
      "stage": "Tầng 3",
      "description": "Lật ngửa mặt vàng của góc tầng 3 về đỉnh U. Lặp lại 2 hoặc 4 lần cho mỗi góc."
    },
    "en": {
      "name": "Orient Corner (R' D' R D)",
      "stage": "Layer 3",
      "description": "Orients yellow corner upward to U. Repeat 2 or 4 times per corner."
    },
    "ja": {
      "name": "コーナー反転 (R' D' R D)",
      "stage": "第3層",
      "description": "上面の黄色を上向きに揃えます。各コーナーごとに2回または4回繰り返します。"
    },
    "zh": {
      "name": "翻转黄色角块 (R' D' R D)",
      "stage": "第3层",
      "description": "将黄色角块朝上翻转，每个角块重复2次或4次。"
    },
    "es": {
      "name": "Orientar esquina (R' D' R D)",
      "stage": "Capa 3",
      "description": "Gira la esquina para que el amarillo mire hacia arriba. Repetir 2 o 4 veces por esquina."
    },
    "fr": {
      "name": "Orienter coin (R' D' R D)",
      "stage": "Étage 3",
      "description": "Oriente le coin jaune vers le haut. Répéter 2 ou 4 fois par coin."
    },
    "de": {
      "name": "Ecke ausrichten (R' D' R D)",
      "stage": "Ebene 3",
      "description": "Richtet die gelbe Ecke nach oben aus. 2 oder 4 Mal pro Ecke wiederholen."
    },
    "ru": {
      "name": "Разворот угла (R' D' R D)",
      "stage": "3-й слой",
      "description": "Разворачивает желтый угол наверх. Повторять 2 или 4 раза для каждого угла."
    },
    "pt": {
      "name": "Orientar canto (R' D' R D)",
      "stage": "Camada 3",
      "description": "Orienta o canto amarelo para cima. Repita 2 ou 4 vezes por canto."
    },
    "ko": {
      "name": "코너 방향 뒤집기 (R' D' R D)",
      "stage": "3층",
      "description": "노란색이 윗면을 향하도록 코너를 뒤집습니다. 코너당 2회 또는 4회 반복합니다."
    },
    "it": {
      "name": "Orienta angolo (R' D' R D)",
      "stage": "3° Strato",
      "description": "Orienta l'angolo giallo verso l'alto. Ripeti 2 o 4 volte per ciascun angolo."
    },
    "ar": {
      "name": "توجيه الزاوية (R' D' R D)",
      "stage": "الطبقة 3",
      "description": "يوجه الزاوية الصفراء نحو الأعلى. كرر مرتين أو 4 مرات لكل زاوية."
    },
    "hi": {
      "name": "कोना मोड़ना (R' D' R D)",
      "stage": "परत 3",
      "description": "पीले कोने को ऊपर U की ओर मोड़ता है। प्रत्येक कोने के लिए 2 या 4 बार दोहराएं।"
    },
    "id": {
      "name": "Orientasi Sudut (R' D' R D)",
      "stage": "Lapisan 3",
      "description": "Mengarahkan sudut kuning ke atas. Ulangi 2 atau 4 kali per sudut."
    },
    "tr": {
      "name": "Köşe Yönlendirme (R' D' R D)",
      "stage": "Katman 3",
      "description": "Sarı köşeyi yukarı baktırır. Her köşe için 2 veya 4 kez tekrarlayın."
    }
  },
  "t-perm": {
    "sequence": [
      "R",
      "U",
      "R'",
      "U'",
      "R'",
      "F",
      "R2",
      "U'",
      "R'",
      "U'",
      "R",
      "U",
      "R'",
      "F'"
    ],
    "vi": {
      "name": "T-Perm (Hoán vị góc & cạnh)",
      "stage": "PLL Nâng cao",
      "description": "Công thức PLL chữ T nổi tiếng nhất hoán vị 2 góc phải và 2 cạnh liền kề."
    },
    "en": {
      "name": "T-Perm (Permute Corners & Edges)",
      "stage": "Advanced PLL",
      "description": "Famous T-Perm swapping 2 right corners and 2 adjacent edges."
    },
    "ja": {
      "name": "T-Perm (コーナー＆エッジ交換)",
      "stage": "上級 PLL",
      "description": "右側2コーナーと隣接2エッジを同時に交換する定番PLL公式。"
    },
    "zh": {
      "name": "T-Perm 经典置换",
      "stage": "高级 PLL",
      "description": "最著名的T型PLL手法，同时交换右侧两个角块与相邻两棱块。"
    },
    "es": {
      "name": "T-Perm (Permutar esquinas y aristas)",
      "stage": "PLL Avanzado",
      "description": "Famoso T-Perm que intercambia 2 esquinas derechas y 2 aristas adyacentes."
    },
    "fr": {
      "name": "T-Perm (Permuter coins et arêtes)",
      "stage": "PLL Avancé",
      "description": "Célèbre T-Perm échangeant 2 coins droits et 2 arêtes adjacentes."
    },
    "de": {
      "name": "T-Perm (Ecken & Kanten tauschen)",
      "stage": "Erweitertes PLL",
      "description": "Berühmter T-Perm zum Tauschen von 2 rechten Ecken und 2 benachbarten Kanten."
    },
    "ru": {
      "name": "Т-Перм (Перестановка углов и ребер)",
      "stage": "Продвинутый PLL",
      "description": "Знаменитый T-Perm, меняющий местами 2 правых угла и 2 соседних ребра."
    },
    "pt": {
      "name": "T-Perm (Permutar cantos e meios)",
      "stage": "PLL Avançado",
      "description": "Famoso T-Perm que troca 2 cantos direitos e 2 meios adjacentes."
    },
    "ko": {
      "name": "T-Perm (코너 및 엣지 교환)",
      "stage": "고급 PLL",
      "description": "우측 2개 코너와 인접한 2개 엣지를 동시에 맞바꾸는 대표적인 T자 PLL 공식."
    },
    "it": {
      "name": "T-Perm (Scambio angoli e spigoli)",
      "stage": "PLL Avanzato",
      "description": "Famoso T-Perm che scambia 2 angoli destri e 2 spigoli adiacenti."
    },
    "ar": {
      "name": "T-Perm (تبديل الزوايا والحواف)",
      "stage": "PLL متقدم",
      "description": "صيغة T-Perm الشهيرة التي تبدل زاويتين يمينيتين وحافتين متجاورتين."
    },
    "hi": {
      "name": "टी-पर्म (कोने और किनारे बदलना)",
      "stage": "उन्नत PLL",
      "description": "प्रसिद्ध T-Perm जो 2 दाएं कोनों और 2 आसन्न किनारों की अदला-बदली करता है।"
    },
    "id": {
      "name": "T-Perm (Tukar Sudut & Tepi)",
      "stage": "PLL Lanjutan",
      "description": "T-Perm terkenal yang menukar 2 sudut kanan dan 2 tepi yang berdekatan."
    },
    "tr": {
      "name": "T-Perm (Köşe ve Kenar Değişimi)",
      "stage": "İleri PLL",
      "description": "Sağdaki 2 köşe ile 2 bitişik kenarı yer değiştiren ünlü T-Perm formülü."
    }
  }
};

export const FORMULAS = Object.entries(FORMULA_I18N).map(([id, item]) => ({
  id,
  sequence: item.sequence,
  get name() {
    const lang = i18n.getLanguage();
    return item[lang]?.name || item.en?.name || item.vi?.name;
  },
  get stage() {
    const lang = i18n.getLanguage();
    return item[lang]?.stage || item.en?.stage || item.vi?.stage;
  },
  get description() {
    const lang = i18n.getLanguage();
    return item[lang]?.description || item.en?.description || item.vi?.description;
  }
}));

export class FormulaTrainer {
  constructor(rubik3D, mandala, onStepChange) {
    this.rubik3D = rubik3D;
    this.mandala = mandala;
    this.onStepChange = onStepChange;

    this.currentFormula = null;
    this.stepIndex = 0;
    this.isPlaying = false;
    this.playTimer = null;
  }

  loadFormula(formulaId) {
    this.stop();
    this.currentFormula = FORMULAS.find(f => f.id === formulaId) || null;
    this.stepIndex = 0;
    if (this.onStepChange) {
      this.onStepChange(this.currentFormula, this.stepIndex);
    }
  }

  nextStep() {
    if (!this.currentFormula) return;
    if (this.stepIndex >= this.currentFormula.sequence.length) {
      this.stepIndex = 0;
      if (this.onStepChange) {
        this.onStepChange(this.currentFormula, this.stepIndex);
      }
    }

    const move = this.currentFormula.sequence[this.stepIndex];
    this.rubik3D.queueMove(move);

    this.stepIndex++;
    if (this.onStepChange) {
      this.onStepChange(this.currentFormula, this.stepIndex);
    }

    if (this.stepIndex >= this.currentFormula.sequence.length) {
      this.stop();
    }
  }

  playAll(speedMs = 450) {
    if (!this.currentFormula) return;
    if (this.isPlaying) return;

    // Tự động tua lại từ đầu nếu đã chạy hết chuỗi công thức
    if (this.stepIndex >= this.currentFormula.sequence.length) {
      this.stepIndex = 0;
      if (this.onStepChange) {
        this.onStepChange(this.currentFormula, this.stepIndex);
      }
    }

    this.isPlaying = true;
    const playNext = () => {
      if (!this.isPlaying) return;
      if (this.stepIndex >= this.currentFormula.sequence.length) {
        this.stop();
        return;
      }
      this.nextStep();
      this.playTimer = setTimeout(playNext, speedMs);
    };

    playNext();
  }

  stop() {
    this.isPlaying = false;
    if (this.playTimer) {
      clearTimeout(this.playTimer);
      this.playTimer = null;
    }
  }

  resetProgress() {
    this.stop();
    this.stepIndex = 0;
    if (this.onStepChange) {
      this.onStepChange(this.currentFormula, this.stepIndex);
    }
  }
}
