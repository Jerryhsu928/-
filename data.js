/**
 * 國中九年級形音義複習系統 - 核心資料庫 (data.js)
 * 資料來源：教師提供之 Google Sheet TSV，並經人工校正選項。
 * 共 150 題，分為六回，每回 25 題。
 */

const RAW_SHEET_DATA =
[
    {
        "round":  1,
        "type":  "shape",
        "question":  "大「ㄎㄨㄞˋ」朵頤",
        "answer":  "快",
        "options":  [
                        "快",
                        "塊",
                        "筷",
                        "膾"
                    ],
        "note":  "「大「ㄎㄨㄞˋ」朵頤」的正確答案是「快」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "番「ㄑㄧㄝˊ」炒蛋",
        "answer":  "茄",
        "options":  [
                        "協",
                        "伽",
                        "笳",
                        "茄"
                    ],
        "note":  "「番「ㄑㄧㄝˊ」炒蛋」的正確答案是「茄」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "刀「ㄒㄧㄠ」麵",
        "answer":  "削",
        "options":  [
                        "消",
                        "霄",
                        "削",
                        "宵"
                    ],
        "note":  "「刀「ㄒㄧㄠ」麵」的正確答案是「削」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "「ㄊㄨˇ」魠魚",
        "answer":  "𩵚",
        "options":  [
                        "兔",
                        "𩵚",
                        "土",
                        "吐"
                    ],
        "note":  "「「ㄊㄨˇ」魠魚」的正確答案是「𩵚」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "小米「ㄓㄡ」",
        "answer":  "粥",
        "options":  [
                        "粥",
                        "州",
                        "洲",
                        "週"
                    ],
        "note":  "「小米「ㄓㄡ」」的正確答案是「粥」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "人參枸「ㄑㄧˇ」",
        "answer":  "杞",
        "options":  [
                        "起",
                        "己",
                        "紀",
                        "杞"
                    ],
        "note":  "「人參枸「ㄑㄧˇ」」的正確答案是「杞」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "雞「ㄖㄨㄥˊ」玉米濃湯",
        "answer":  "茸",
        "options":  [
                        "絨",
                        "容",
                        "茸",
                        "融"
                    ],
        "note":  "「雞「ㄖㄨㄥˊ」玉米濃湯」的正確答案是「茸」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "香酥排「ㄌㄜˋ」",
        "answer":  "肋",
        "options":  [
                        "脅",
                        "肋",
                        "勒",
                        "助"
                    ],
        "note":  "「香酥排「ㄌㄜˋ」」的正確答案是「肋」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "北京「ㄌㄠˋ」餅",
        "answer":  "烙",
        "options":  [
                        "烙",
                        "落",
                        "洛",
                        "絡"
                    ],
        "note":  "「北京「ㄌㄠˋ」餅」的正確答案是「烙」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "豆「ㄔˇ」牡蠣",
        "answer":  "豉",
        "options":  [
                        "鼓",
                        "豆",
                        "皷",
                        "豉"
                    ],
        "note":  "「豆「ㄔˇ」牡蠣」的正確答案是「豉」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "「ㄋㄨㄛˋ」米飯",
        "answer":  "糯",
        "options":  [
                        "儒",
                        "濡",
                        "糯",
                        "懦"
                    ],
        "note":  "「「ㄋㄨㄛˋ」米飯」的正確答案是「糯」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "「ㄘㄠ」米飯",
        "answer":  "糙",
        "options":  [
                        "躁",
                        "糙",
                        "操",
                        "燥"
                    ],
        "note":  "「「ㄘㄠ」米飯」的正確答案是「糙」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "「ㄐㄩˊ」烤飯",
        "answer":  "焗",
        "options":  [
                        "焗",
                        "局",
                        "鋦",
                        "拘"
                    ],
        "note":  "「「ㄐㄩˊ」烤飯」的正確答案是「焗」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "涼拌牛「ㄅㄤˋ」",
        "answer":  "蒡",
        "options":  [
                        "旁",
                        "榜",
                        "膀",
                        "蒡"
                    ],
        "note":  "「涼拌牛「ㄅㄤˋ」」的正確答案是「蒡」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "滷雞「ㄓㄣ」",
        "answer":  "胗",
        "options":  [
                        "針",
                        "診",
                        "胗",
                        "珍"
                    ],
        "note":  "「滷雞「ㄓㄣ」」的正確答案是「胗」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "紅豆「ㄘㄨㄛˋ」冰",
        "answer":  "剉",
        "options":  [
                        "坐",
                        "剉",
                        "挫",
                        "銼"
                    ],
        "note":  "「紅豆「ㄘㄨㄛˋ」冰」的正確答案是「剉」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "「ㄧㄢ」芭樂",
        "answer":  "醃",
        "options":  [
                        "醃",
                        "淹",
                        "掩",
                        "奄"
                    ],
        "note":  "「「ㄧㄢ」芭樂」的正確答案是「醃」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "蒸「ㄌㄧㄡˋ」水",
        "answer":  "餾",
        "options":  [
                        "流",
                        "留",
                        "榴",
                        "餾"
                    ],
        "note":  "「蒸「ㄌㄧㄡˋ」水」的正確答案是「餾」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "「ㄓㄣ」果拿鐵",
        "answer":  "榛",
        "options":  [
                        "蓁",
                        "臻",
                        "榛",
                        "珍"
                    ],
        "note":  "「「ㄓㄣ」果拿鐵」的正確答案是「榛」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "歐「ㄌㄟˇ」咖啡",
        "answer":  "蕾",
        "options":  [
                        "壘",
                        "蕾",
                        "雷",
                        "儡"
                    ],
        "note":  "「歐「ㄌㄟˇ」咖啡」的正確答案是「蕾」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "「ㄐㄩˇ」弱果凍",
        "answer":  "蒟",
        "options":  [
                        "蒟",
                        "弱",
                        "苟",
                        "句"
                    ],
        "note":  "「「ㄐㄩˇ」弱果凍」的正確答案是「蒟」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "紅燒牛「ㄋㄢˇ」",
        "answer":  "腩",
        "options":  [
                        "南",
                        "楠",
                        "喃",
                        "腩"
                    ],
        "note":  "「紅燒牛「ㄋㄢˇ」」的正確答案是「腩」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "「ㄌㄨˇ」肉飯",
        "answer":  "滷",
        "options":  [
                        "鹵",
                        "擄",
                        "滷",
                        "魯"
                    ],
        "note":  "「「ㄌㄨˇ」肉飯」的正確答案是「滷」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "清「ㄉㄨㄣˋ」牛肉",
        "answer":  "燉",
        "options":  [
                        "鈍",
                        "燉",
                        "頓",
                        "噸"
                    ],
        "note":  "「清「ㄉㄨㄣˋ」牛肉」的正確答案是「燉」。"
    },
    {
        "round":  1,
        "type":  "shape",
        "question":  "牛「ㄐㄧㄢˋ」切片",
        "answer":  "腱",
        "options":  [
                        "腱",
                        "健",
                        "鍵",
                        "建"
                    ],
        "note":  "「牛「ㄐㄧㄢˋ」切片」的正確答案是「腱」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「莧」菜小魚的讀音",
        "answer":  "ㄒㄧㄢˋ",
        "options":  [
                        "ㄒㄧㄢ",
                        "ㄐㄧㄢˋ",
                        "ㄒㄧㄢˊ",
                        "ㄒㄧㄢˋ"
                    ],
        "note":  "「「莧」菜小魚的讀音」的正確答案是「ㄒㄧㄢˋ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "金「桔」檸檬的讀音",
        "answer":  "ㄐㄩˊ",
        "options":  [
                        "ㄐㄩˊ",
                        "ㄐㄧㄝˊ",
                        "ㄐㄧˊ",
                        "ㄐㄩˇ"
                    ],
        "note":  "「金「桔」檸檬的讀音」的正確答案是「ㄐㄩˊ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "豬「肚」湯的讀音",
        "answer":  "ㄉㄨˇ",
        "options":  [
                        "ㄉㄨ",
                        "ㄉㄨˇ",
                        "ㄉㄨˋ",
                        "ㄊㄨˇ"
                    ],
        "note":  "「豬「肚」湯的讀音」的正確答案是「ㄉㄨˇ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "牛肉「煲」湯的讀音",
        "answer":  "ㄅㄠ",
        "options":  [
                        "ㄅㄠˋ",
                        "ㄆㄠ",
                        "ㄅㄠ",
                        "ㄅㄠˇ"
                    ],
        "note":  "「牛肉「煲」湯的讀音」的正確答案是「ㄅㄠ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "元「盅」雞湯的讀音",
        "answer":  "ㄓㄨㄥ",
        "options":  [
                        "ㄓㄨㄥˊ",
                        "ㄓㄨㄥ",
                        "ㄓㄨㄥˋ",
                        "ㄔㄨㄥ"
                    ],
        "note":  "「元「盅」雞湯的讀音」的正確答案是「ㄓㄨㄥ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "菜「脯」蛋的讀音",
        "answer":  "ㄈㄨˇ",
        "options":  [
                        "ㄈㄨˇ",
                        "ㄆㄨˇ",
                        "ㄅㄨˇ",
                        "ㄅㄨˋ"
                    ],
        "note":  "「菜「脯」蛋的讀音」的正確答案是「ㄈㄨˇ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "鼎邊「銼」的讀音",
        "answer":  "ㄘㄨㄛˋ",
        "options":  [
                        "ㄘㄨㄛˋ",
                        "ㄙㄨㄛ",
                        "ㄘㄨㄛ",
                        "ㄘㄨㄛˇ"
                    ],
        "note":  "「鼎邊「銼」的讀音」的正確答案是「ㄘㄨㄛˋ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「腓」力牛排的讀音",
        "answer":  "ㄈㄟˊ",
        "options":  [
                        "ㄈㄟˊ",
                        "ㄈㄟ",
                        "ㄆㄟˊ",
                        "ㄈㄟˇ"
                    ],
        "note":  "「腓力牛排」的「腓」讀作「ㄈㄟˊ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「煨」牛肉的讀音",
        "answer":  "ㄨㄟ",
        "options":  [
                        "ㄨㄟˋ",
                        "ㄨㄟˊ",
                        "ㄨㄟˇ",
                        "ㄨㄟ"
                    ],
        "note":  "「「煨」牛肉的讀音」的正確答案是「ㄨㄟ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "新港「飴」的讀音",
        "answer":  "ㄧˊ",
        "options":  [
                        "ㄧˊ",
                        "ㄧˋ",
                        "ㄊㄞˊ",
                        "ㄧˇ"
                    ],
        "note":  "「新港「飴」的讀音」的正確答案是「ㄧˊ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "草仔「粿」的讀音",
        "answer":  "ㄍㄨㄛˇ",
        "options":  [
                        "ㄍㄨㄛˇ",
                        "ㄎㄨㄟˋ",
                        "ㄍㄨㄟˇ",
                        "ㄎㄨㄛˋ"
                    ],
        "note":  "「草仔「粿」的讀音」的正確答案是「ㄍㄨㄛˇ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "紅燒蹄「膀」的讀音",
        "answer":  "ㄅㄤˇ",
        "options":  [
                        "ㄆㄤˊ",
                        "ㄅㄤ",
                        "ㄅㄤˇ",
                        "ㄅㄤˋ"
                    ],
        "note":  "「紅燒蹄「膀」的讀音」的正確答案是「ㄅㄤˇ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "味「噌」湯的讀音",
        "answer":  "ㄘㄥ",
        "options":  [
                        "ㄘㄥ",
                        "ㄔㄥˊ",
                        "ㄗㄥ",
                        "ㄙㄥ"
                    ],
        "note":  "「味噌湯」的「噌」讀作「ㄘㄥ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「蚵」仔煎的讀音",
        "answer":  "ㄜˊ",
        "options":  [
                        "ㄜˊ",
                        "ㄎㄜ",
                        "ㄜˋ",
                        "ㄏㄜˊ"
                    ],
        "note":  "「「蚵」仔煎的讀音」的正確答案是「ㄜˊ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "綜「合」果汁的讀音",
        "answer":  "ㄏㄜˊ",
        "options":  [
                        "ㄍㄜˊ",
                        "ㄏㄜˋ",
                        "ㄜˊ",
                        "ㄏㄜˊ"
                    ],
        "note":  "「綜「合」果汁的讀音」的正確答案是「ㄏㄜˊ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「涮」牛肉的讀音",
        "answer":  "ㄕㄨㄢˋ",
        "options":  [
                        "ㄕㄨㄢˋ",
                        "ㄕㄨㄚˋ",
                        "ㄕㄨㄚ",
                        "ㄙㄨㄢˋ"
                    ],
        "note":  "「「涮」牛肉的讀音」的正確答案是「ㄕㄨㄢˋ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "牛肉「燴」飯的讀音",
        "answer":  "ㄏㄨㄟˋ",
        "options":  [
                        "ㄏㄨㄟˊ",
                        "ㄎㄨㄟˋ",
                        "ㄏㄨㄟ",
                        "ㄏㄨㄟˋ"
                    ],
        "note":  "「牛肉「燴」飯的讀音」的正確答案是「ㄏㄨㄟˋ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「餛」飩湯的讀音",
        "answer":  "ㄏㄨㄣˊ",
        "options":  [
                        "ㄏㄨㄣ",
                        "ㄏㄨㄥˊ",
                        "ㄏㄨㄣˊ",
                        "ㄏㄨㄣˋ"
                    ],
        "note":  "「「餛」飩湯的讀音」的正確答案是「ㄏㄨㄣˊ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「咖」哩飯的讀音",
        "answer":  "ㄎㄚ",
        "options":  [
                        "ㄎㄚˇ",
                        "ㄎㄚ",
                        "ㄐㄧㄚ",
                        "ㄍㄚ"
                    ],
        "note":  "「「咖」哩飯的讀音」的正確答案是「ㄎㄚ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "蛤「蜊」濃湯的讀音",
        "answer":  "ㄌㄧˊ",
        "options":  [
                        "ㄌㄧˊ",
                        "ㄌㄧˋ",
                        "ㄌㄧ",
                        "ㄍㄚ"
                    ],
        "note":  "「蛤「蜊」濃湯的讀音」的正確答案是「ㄌㄧˊ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "勾「芡」料理的讀音",
        "answer":  "ㄑㄧㄢˋ",
        "options":  [
                        "ㄑㄧㄥˋ",
                        "ㄑㄧㄢˋ",
                        "ㄑㄧㄢ",
                        "ㄒㄧㄢˋ"
                    ],
        "note":  "「勾「芡」料理的讀音」的正確答案是「ㄑㄧㄢˋ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「汆」燙肉片的讀音",
        "answer":  "ㄘㄨㄢ",
        "options":  [
                        "ㄘㄨㄢ",
                        "ㄔㄨㄢ",
                        "ㄘㄨㄢˋ",
                        "ㄙㄨㄢ"
                    ],
        "note":  "「「汆」燙肉片的讀音」的正確答案是「ㄘㄨㄢ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「炸」醬麵的讀音",
        "answer":  "ㄓㄚˊ",
        "options":  [
                        "ㄓㄚˊ",
                        "ㄓㄚˋ",
                        "ㄓㄚ",
                        "ㄗㄚˋ"
                    ],
        "note":  "「「炸」醬麵的讀音」的正確答案是「ㄓㄚˊ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "肉「燥」飯的讀音",
        "answer":  "ㄙㄠˋ",
        "options":  [
                        "ㄙㄠˋ",
                        "ㄗㄠˋ",
                        "ㄘㄠˋ",
                        "ㄙㄠ"
                    ],
        "note":  "「肉燥飯」的「燥」讀作「ㄙㄠˋ」。"
    },
    {
        "round":  2,
        "type":  "pronunciation",
        "question":  "「什」錦炒麵的讀音",
        "answer":  "ㄕˊ",
        "options":  [
                        "ㄕ",
                        "ㄕˋ",
                        "ㄙˊ",
                        "ㄕˊ"
                    ],
        "note":  "「「什」錦炒麵的讀音」的正確答案是「ㄕˊ」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "水池乾「ㄏㄜˊ」",
        "answer":  "涸",
        "options":  [
                        "固",
                        "沽",
                        "涸",
                        "錮"
                    ],
        "note":  "「水池乾「ㄏㄜˊ」」的正確答案是「涸」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "「ㄔˋ」吒風雲",
        "answer":  "叱",
        "options":  [
                        "吒",
                        "叱",
                        "吃",
                        "斥"
                    ],
        "note":  "「「ㄔˋ」吒風雲」的正確答案是「叱」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "「ㄏㄤˋ」瀣一氣",
        "answer":  "沆",
        "options":  [
                        "沆",
                        "航",
                        "杭",
                        "抗"
                    ],
        "note":  "「「ㄏㄤˋ」瀣一氣」的正確答案是「沆」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "「ㄐㄧㄥ」渭分明",
        "answer":  "涇",
        "options":  [
                        "徑",
                        "經",
                        "莖",
                        "涇"
                    ],
        "note":  "「「ㄐㄧㄥ」渭分明」的正確答案是「涇」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "正值「ㄕㄤˇ」午",
        "answer":  "晌",
        "options":  [
                        "響",
                        "晃",
                        "晌",
                        "餉"
                    ],
        "note":  "「正值「ㄕㄤˇ」午」的正確答案是「晌」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "寒「ㄒㄩㄢ」問候",
        "answer":  "暄",
        "options":  [
                        "煊",
                        "暄",
                        "喧",
                        "宣"
                    ],
        "note":  "「寒「ㄒㄩㄢ」問候」的正確答案是「暄」。"
    },
    {
        "round":  3,
        "type":  "pronunciation",
        "question":  "落日餘「暉」的讀音",
        "answer":  "ㄏㄨㄟ",
        "options":  [
                        "ㄏㄨㄟ",
                        "ㄏㄨㄟˊ",
                        "ㄏㄨㄟˇ",
                        "ㄏㄨㄟˋ"
                    ],
        "note":  "「落日餘「暉」的讀音」的正確答案是「ㄏㄨㄟ」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "颯「ㄙㄚˋ」風響",
        "answer":  "颯",
        "options":  [
                        "薩",
                        "灑",
                        "煞",
                        "颯"
                    ],
        "note":  "「颯「ㄙㄚˋ」風響」的正確答案是「颯」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "廣闊蒼「ㄑㄩㄥ」",
        "answer":  "穹",
        "options":  [
                        "芎",
                        "選4",
                        "穹",
                        "窮"
                    ],
        "note":  "「廣闊蒼「ㄑㄩㄥ」」的正確答案是「穹」。"
    },
    {
        "round":  3,
        "type":  "pronunciation",
        "question":  "「曙」光乍現的讀音",
        "answer":  "ㄕㄨˋ",
        "options":  [
                        "ㄕㄨˋ",
                        "ㄕㄨˇ",
                        "ㄕㄨ",
                        "ㄙㄨˋ"
                    ],
        "note":  "「「曙」光乍現的讀音」的正確答案是「ㄕㄨˋ」。"
    },
    {
        "round":  3,
        "type":  "pronunciation",
        "question":  "冬溫夏「凊」的讀音",
        "answer":  "ㄐㄧㄥˋ",
        "options":  [
                        "ㄐㄧㄥˋ",
                        "ㄑㄧㄥˋ",
                        "ㄐㄧㄥ",
                        "ㄑㄧㄥ"
                    ],
        "note":  "「冬溫夏「凊」的讀音」的正確答案是「ㄐㄧㄥˋ」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "夜觀星「ㄒㄧㄡˋ」",
        "answer":  "宿",
        "options":  [
                        "秀",
                        "袖",
                        "繡",
                        "宿"
                    ],
        "note":  "「夜觀星「ㄒㄧㄡˋ」」的正確答案是「宿」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "「ㄙㄨㄥ」山少林",
        "answer":  "嵩",
        "options":  [
                        "松",
                        "崧",
                        "嵩",
                        "聳"
                    ],
        "note":  "「「ㄙㄨㄥ」山少林」的正確答案是「嵩」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "「ㄙㄨˋ」夜匪懈",
        "answer":  "夙",
        "options":  [
                        "速",
                        "夙",
                        "宿",
                        "肅"
                    ],
        "note":  "「「ㄙㄨˋ」夜匪懈」的正確答案是「夙」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "花東「ㄗㄨㄥ」谷",
        "answer":  "縱",
        "options":  [
                        "縱",
                        "總",
                        "綜",
                        "宗"
                    ],
        "note":  "「花東「ㄗㄨㄥ」谷」的正確答案是「縱」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "餐松飲「ㄐㄧㄢˋ」",
        "answer":  "澗",
        "options":  [
                        "簡",
                        "間",
                        "漸",
                        "澗"
                    ],
        "note":  "「餐松飲「ㄐㄧㄢˋ」」的正確答案是「澗」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "陷入泥「ㄋㄠˋ」",
        "answer":  "淖",
        "options":  [
                        "綽",
                        "罩",
                        "淖",
                        "悼"
                    ],
        "note":  "「陷入泥「ㄋㄠˋ」」的正確答案是「淖」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "險要「ㄞˋ」口",
        "answer":  "隘",
        "options":  [
                        "嗌",
                        "隘",
                        "溢",
                        "縊"
                    ],
        "note":  "「險要「ㄞˋ」口」的正確答案是「隘」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "驚「ㄊㄠˊ」駭浪",
        "answer":  "濤",
        "options":  [
                        "濤",
                        "滔",
                        "淘",
                        "掏"
                    ],
        "note":  "「驚「ㄊㄠˊ」駭浪」的正確答案是「濤」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "萬「ㄌㄞˋ」俱寂",
        "answer":  "籟",
        "options":  [
                        "賴",
                        "瀨",
                        "獺",
                        "籟"
                    ],
        "note":  "「萬「ㄌㄞˋ」俱寂」的正確答案是「籟」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "天氣「ㄩˋ」熱",
        "answer":  "燠",
        "options":  [
                        "懊",
                        "澳",
                        "燠",
                        "奧"
                    ],
        "note":  "「天氣「ㄩˋ」熱」的正確答案是「燠」。"
    },
    {
        "round":  3,
        "type":  "pronunciation",
        "question":  "未雨綢「繆」的讀音",
        "answer":  "ㄇㄡˊ",
        "options":  [
                        "ㄇㄡˊ",
                        "ㄇㄧㄡˋ",
                        "ㄌㄧㄠˊ",
                        "ㄇㄧㄠˋ"
                    ],
        "note":  "「未雨綢「繆」的讀音」的正確答案是「ㄇㄡˊ」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "光風「ㄐㄧˋ」月",
        "answer":  "霽",
        "options":  [
                        "霽",
                        "濟",
                        "際",
                        "齊"
                    ],
        "note":  "「光風「ㄐㄧˋ」月」的正確答案是「霽」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "下起冰「ㄅㄠˊ」",
        "answer":  "雹",
        "options":  [
                        "飽",
                        "孢",
                        "苞",
                        "雹"
                    ],
        "note":  "「下起冰「ㄅㄠˊ」」的正確答案是「雹」。"
    },
    {
        "round":  3,
        "type":  "shape",
        "question":  "掃除陰「ㄇㄞˊ」",
        "answer":  "霾",
        "options":  [
                        "邁",
                        "釐",
                        "霾",
                        "埋"
                    ],
        "note":  "「掃除陰「ㄇㄞˊ」」的正確答案是「霾」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "物腐生「蛆」的讀音",
        "answer":  "ㄑㄩ",
        "options":  [
                        "ㄑㄩ",
                        "ㄗㄠˇ",
                        "ㄖㄨㄟˋ",
                        "ㄐㄩㄝˊ"
                    ],
        "note":  "「物腐生「蛆」的讀音」的正確答案是「ㄑㄩ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "跳「蚤」市場的讀音",
        "answer":  "ㄗㄠˇ",
        "options":  [
                        "ㄗㄠˇ",
                        "ㄖㄨㄟˋ",
                        "ㄐㄩㄝˊ",
                        "ㄆㄧㄠˊ"
                    ],
        "note":  "「跳「蚤」市場的讀音」的正確答案是「ㄗㄠˇ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "蚊「蚋」的讀音",
        "answer":  "ㄖㄨㄟˋ",
        "options":  [
                        "ㄖㄨㄟˋ",
                        "ㄐㄩㄝˊ",
                        "ㄆㄧㄠˊ",
                        "ㄍㄨ"
                    ],
        "note":  "「蚊「蚋」的讀音」的正確答案是「ㄖㄨㄟˋ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "子「孓」的讀音",
        "answer":  "ㄐㄩㄝˊ",
        "options":  [
                        "ㄐㄩㄝˊ",
                        "ㄆㄧㄠˊ",
                        "ㄍㄨ",
                        "ㄋㄠˊ"
                    ],
        "note":  "「子「孓」的讀音」的正確答案是「ㄐㄩㄝˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "七星「瓢」蟲的讀音",
        "answer":  "ㄆㄧㄠˊ",
        "options":  [
                        "ㄆㄧㄠˊ",
                        "ㄍㄨ",
                        "ㄋㄠˊ",
                        "ㄊㄠ"
                    ],
        "note":  "「七星「瓢」蟲的讀音」的正確答案是「ㄆㄧㄠˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "螻「蛄」的讀音",
        "answer":  "ㄍㄨ",
        "options":  [
                        "ㄍㄨ",
                        "ㄋㄠˊ",
                        "ㄊㄠ",
                        "ㄧㄤˋ"
                    ],
        "note":  "「螻「蛄」的讀音」的正確答案是「ㄍㄨ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "「蟯」蟲的讀音",
        "answer":  "ㄋㄠˊ",
        "options":  [
                        "ㄋㄠˊ",
                        "ㄊㄠ",
                        "ㄧㄤˋ",
                        "ㄋㄩㄝˋ"
                    ],
        "note":  "「「蟯」蟲的讀音」的正確答案是「ㄋㄠˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "有鉤「絛」蟲的讀音",
        "answer":  "ㄊㄠ",
        "options":  [
                        "ㄊㄠ",
                        "ㄧㄤˋ",
                        "ㄋㄩㄝˋ",
                        "ㄉㄨˋ"
                    ],
        "note":  "「有鉤「絛」蟲的讀音」的正確答案是「ㄊㄠ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "「恙」蟲的讀音",
        "answer":  "ㄧㄤˋ",
        "options":  [
                        "ㄧㄤˋ",
                        "ㄋㄩㄝˋ",
                        "ㄉㄨˋ",
                        "ㄆㄧˊ"
                    ],
        "note":  "「「恙」蟲的讀音」的正確答案是「ㄧㄤˋ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "「瘧」蚊的讀音",
        "answer":  "ㄋㄩㄝˋ",
        "options":  [
                        "ㄋㄩㄝˋ",
                        "ㄉㄨˋ",
                        "ㄆㄧˊ",
                        "ㄕ"
                    ],
        "note":  "「「瘧」蚊的讀音」的正確答案是「ㄋㄩㄝˋ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "戶樞不「蠹」的讀音",
        "answer":  "ㄉㄨˋ",
        "options":  [
                        "ㄉㄨˋ",
                        "ㄆㄧˊ",
                        "ㄕ",
                        "ㄇㄥˊ"
                    ],
        "note":  "「戶樞不「蠹」的讀音」的正確答案是「ㄉㄨˋ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "「蚍」蜉撼樹的讀音",
        "answer":  "ㄆㄧˊ",
        "options":  [
                        "ㄆㄧˊ",
                        "ㄕ",
                        "ㄇㄥˊ",
                        "ㄓㄨㄥ"
                    ],
        "note":  "「「蚍」蜉撼樹的讀音」的正確答案是「ㄆㄧˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "捫「蝨」而言的讀音",
        "answer":  "ㄕ",
        "options":  [
                        "ㄕ",
                        "ㄇㄥˊ",
                        "ㄓㄨㄥ",
                        "ㄍㄨˇ"
                    ],
        "note":  "「捫「蝨」而言的讀音」的正確答案是「ㄕ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "蚊「虻」之勞的讀音",
        "answer":  "ㄇㄥˊ",
        "options":  [
                        "ㄇㄥˊ",
                        "ㄓㄨㄥ",
                        "ㄍㄨˇ",
                        "ㄈㄟˇ"
                    ],
        "note":  "「蚊「虻」之勞的讀音」的正確答案是「ㄇㄥˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "草「螽」的讀音",
        "answer":  "ㄓㄨㄥ",
        "options":  [
                        "ㄓㄨㄥ",
                        "ㄍㄨˇ",
                        "ㄈㄟˇ",
                        "ㄑㄩㄥˊ"
                    ],
        "note":  "「草「螽」的讀音」的正確答案是「ㄓㄨㄥ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "下「蠱」害人的讀音",
        "answer":  "ㄍㄨˇ",
        "options":  [
                        "ㄍㄨˇ",
                        "ㄈㄟˇ",
                        "ㄑㄩㄥˊ",
                        "ㄇㄚˋ"
                    ],
        "note":  "「下「蠱」害人的讀音」的正確答案是「ㄍㄨˇ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "「蜚」蠊的讀音",
        "answer":  "ㄈㄟˇ",
        "options":  [
                        "ㄈㄟˇ",
                        "ㄑㄩㄥˊ",
                        "ㄇㄚˋ",
                        "ㄌㄧㄥˊ"
                    ],
        "note":  "「「蜚」蠊的讀音」的正確答案是「ㄈㄟˇ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "寒「蛩」的讀音",
        "answer":  "ㄑㄩㄥˊ",
        "options":  [
                        "ㄑㄩㄥˊ",
                        "ㄇㄚˋ",
                        "ㄌㄧㄥˊ",
                        "ㄊㄧㄠˊ"
                    ],
        "note":  "「寒「蛩」的讀音」的正確答案是「ㄑㄩㄥˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "「螞」蚱的讀音",
        "answer":  "ㄇㄚˋ",
        "options":  [
                        "ㄇㄚˋ",
                        "ㄌㄧㄥˊ",
                        "ㄊㄧㄠˊ",
                        "ㄏㄨㄛˋ"
                    ],
        "note":  "「「螞」蚱的讀音」的正確答案是「ㄇㄚˋ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "螟「蛉」的讀音",
        "answer":  "ㄌㄧㄥˊ",
        "options":  [
                        "ㄌㄧㄥˊ",
                        "ㄊㄧㄠˊ",
                        "ㄏㄨㄛˋ",
                        "ㄇㄠˊ"
                    ],
        "note":  "「螟「蛉」的讀音」的正確答案是「ㄌㄧㄥˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "螗「蜩」的讀音",
        "answer":  "ㄊㄧㄠˊ",
        "options":  [
                        "ㄊㄧㄠˊ",
                        "ㄏㄨㄛˋ",
                        "ㄇㄠˊ",
                        "ㄑㄧㄡˊ"
                    ],
        "note":  "「螗「蜩」的讀音」的正確答案是「ㄊㄧㄠˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "尺「蠖」之屈的讀音",
        "answer":  "ㄏㄨㄛˋ",
        "options":  [
                        "ㄏㄨㄛˋ",
                        "ㄇㄠˊ",
                        "ㄑㄧㄡˊ",
                        "ㄑㄧㄣˊ"
                    ],
        "note":  "「尺「蠖」之屈的讀音」的正確答案是「ㄏㄨㄛˋ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "「蟊」賊的讀音",
        "answer":  "ㄇㄠˊ",
        "options":  [
                        "ㄇㄠˊ",
                        "ㄑㄧㄡˊ",
                        "ㄑㄧㄣˊ",
                        "ㄑㄩ"
                    ],
        "note":  "「「蟊」賊的讀音」的正確答案是「ㄇㄠˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "領如「蝤」蠐的讀音",
        "answer":  "ㄑㄧㄡˊ",
        "options":  [
                        "ㄑㄧㄡˊ",
                        "ㄑㄧㄣˊ",
                        "ㄑㄩ",
                        "ㄗㄠˇ"
                    ],
        "note":  "「領如「蝤」蠐的讀音」的正確答案是「ㄑㄧㄡˊ」。"
    },
    {
        "round":  4,
        "type":  "pronunciation",
        "question":  "「螓」首蛾眉的讀音",
        "answer":  "ㄑㄧㄣˊ",
        "options":  [
                        "ㄑㄧㄣˊ",
                        "ㄑㄩ",
                        "ㄗㄠˇ",
                        "ㄖㄨㄟˋ"
                    ],
        "note":  "「「螓」首蛾眉的讀音」的正確答案是「ㄑㄧㄣˊ」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "橫「衝」直撞的字義",
        "answer":  "急速前進",
        "options":  [
                        "急速前進",
                        "突擊",
                        "直著向上頂",
                        "交通要道"
                    ],
        "note":  "「橫「衝」直撞的字義」的正確字義是「急速前進」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「衝」鋒陷陣的字義",
        "answer":  "突擊",
        "options":  [
                        "突擊",
                        "急速前進",
                        "直著向上頂",
                        "交通要道"
                    ],
        "note":  "「「衝」鋒陷陣的字義」的正確字義是「突擊」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "人「事」全非的字義",
        "answer":  "人類所作所為",
        "options":  [
                        "人類所作所為",
                        "侍奉",
                        "變故",
                        "從事"
                    ],
        "note":  "「人「事」全非的字義」的正確字義是「人類所作所為」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "取之不「盡」的字義",
        "answer":  "完結、終止",
        "options":  [
                        "完結、終止",
                        "全部取出",
                        "全部、都",
                        "隱沒"
                    ],
        "note":  "「取之不「盡」的字義」的正確字義是「完結、終止」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "不「盡」相同的字義",
        "answer":  "全部、都",
        "options":  [
                        "全部、都",
                        "全部取出",
                        "完結、終止",
                        "隱沒"
                    ],
        "note":  "「不「盡」相同的字義」的正確字義是「全部、都」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "怒髮「衝」冠的字義",
        "answer":  "直著向上頂",
        "options":  [
                        "直著向上頂",
                        "突擊",
                        "急速前進",
                        "交通要道"
                    ],
        "note":  "「怒髮「衝」冠的字義」的正確字義是「直著向上頂」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "無所「事」事的字義",
        "answer":  "從事",
        "options":  [
                        "從事",
                        "侍奉",
                        "人類所作所為",
                        "變故"
                    ],
        "note":  "「無所「事」事的字義」的正確字義是「從事」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "多「事」之秋的字義",
        "answer":  "變故",
        "options":  [
                        "變故",
                        "侍奉",
                        "人類所作所為",
                        "從事"
                    ],
        "note":  "「多「事」之秋的字義」的正確字義是「變故」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "敲鑼打「鼓」的字義",
        "answer":  "樂器名",
        "options":  [
                        "樂器名",
                        "振動",
                        "漲起",
                        "振作、激勵"
                    ],
        "note":  "「敲鑼打「鼓」的字義」的正確字義是「樂器名」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「事」之以禮的字義",
        "answer":  "侍奉",
        "options":  [
                        "侍奉",
                        "人類所作所為",
                        "變故",
                        "從事"
                    ],
        "note":  "「「事」之以禮的字義」的正確字義是「侍奉」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「鼓」起勇氣的字義",
        "answer":  "振作、激勵",
        "options":  [
                        "振作、激勵",
                        "振動",
                        "漲起",
                        "樂器名"
                    ],
        "note":  "「「鼓」起勇氣的字義」的正確字義是「振作、激勵」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「盡」力而為的字義",
        "answer":  "全部取出",
        "options":  [
                        "全部取出",
                        "全部、都",
                        "完結、終止",
                        "隱沒"
                    ],
        "note":  "「「盡」力而為的字義」的正確字義是「全部取出」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「鼓」動翅膀的字義",
        "answer":  "振動",
        "options":  [
                        "振動",
                        "漲起",
                        "振作、激勵",
                        "樂器名"
                    ],
        "note":  "「「鼓」動翅膀的字義」的正確字義是「振動」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "綠衣「使」者的字義",
        "answer":  "奉命到外國執行任務或留駐的人員",
        "options":  [
                        "奉命到外國執行任務或留駐的人員",
                        "放縱、放任",
                        "派用、任用",
                        "讓、以致於"
                    ],
        "note":  "「綠衣「使」者的字義」的正確字義是「奉命到外國執行任務或留駐的人員」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「使」性子的字義",
        "answer":  "放縱、放任",
        "options":  [
                        "放縱、放任",
                        "派用、任用",
                        "讓、以致於",
                        "出使"
                    ],
        "note":  "「「使」性子的字義」的正確字義是「放縱、放任」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "言之有「物」的字義",
        "answer":  "內容",
        "options":  [
                        "內容",
                        "尋找",
                        "物體",
                        "人、事、境界"
                    ],
        "note":  "「言之有「物」的字義」的正確字義是「內容」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「物」色人選的字義",
        "answer":  "尋找",
        "options":  [
                        "尋找",
                        "內容",
                        "物體",
                        "人、事、境界"
                    ],
        "note":  "「「物」色人選的字義」的正確字義是「尋找」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「物」外之趣的字義",
        "answer":  "物體",
        "options":  [
                        "物體",
                        "內容",
                        "尋找",
                        "人、事、境界"
                    ],
        "note":  "「「物」外之趣的字義」的正確字義是「物體」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "道路要「衝」的字義",
        "answer":  "交通要道",
        "options":  [
                        "交通要道",
                        "突擊",
                        "急速前進",
                        "直著向上頂"
                    ],
        "note":  "「道路要「衝」的字義」的正確字義是「交通要道」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「鼓」著腮幫子的字義",
        "answer":  "漲起",
        "options":  [
                        "漲起",
                        "振動",
                        "振作、激勵",
                        "樂器名"
                    ],
        "note":  "「「鼓」著腮幫子的字義」的正確字義是「漲起」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "孤帆遠影碧山「盡」的字義",
        "answer":  "隱沒",
        "options":  [
                        "隱沒",
                        "全部取出",
                        "全部、都",
                        "完結、終止"
                    ],
        "note":  "「孤帆遠影碧山「盡」的字義」的正確字義是「隱沒」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "待人接「物」的字義",
        "answer":  "人、事、境界",
        "options":  [
                        "人、事、境界",
                        "內容",
                        "物體",
                        "尋找"
                    ],
        "note":  "「待人接「物」的字義」的正確字義是「人、事、境界」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "長「使」英雄淚滿襟的字義",
        "answer":  "讓、以致於",
        "options":  [
                        "讓、以致於",
                        "出使",
                        "派用、任用",
                        "放縱、放任"
                    ],
        "note":  "「長「使」英雄淚滿襟的字義」的正確字義是「讓、以致於」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "晏子「使」楚的字義",
        "answer":  "出使",
        "options":  [
                        "出使",
                        "放縱、放任",
                        "派用、任用",
                        "讓、以致於"
                    ],
        "note":  "「晏子「使」楚的字義」的正確字義是「出使」。"
    },
    {
        "round":  5,
        "type":  "meaning",
        "question":  "「使」功不如使過的字義",
        "answer":  "派用、任用",
        "options":  [
                        "派用、任用",
                        "放縱、放任",
                        "讓、以致於",
                        "出使"
                    ],
        "note":  "「「使」功不如使過的字義」的正確字義是「派用、任用」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "植物花「ㄖㄨㄟˇ」",
        "answer":  "蕊",
        "options":  [
                        "蕊",
                        "芯",
                        "蘂",
                        "蕋"
                    ],
        "note":  "「植物花「ㄖㄨㄟˇ」」的正確答案是「蕊」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "良「ㄧㄡˋ」不齊",
        "answer":  "莠",
        "options":  [
                        "莠",
                        "誘",
                        "秀",
                        "銹"
                    ],
        "note":  "「良「ㄧㄡˋ」不齊」的正確答案是「莠」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "千年紅「ㄎㄨㄞˋ」",
        "answer":  "槐",
        "options":  [
                        "槐",
                        "愧",
                        "瑰",
                        "魁"
                    ],
        "note":  "「千年紅「ㄎㄨㄞˋ」」的正確答案是「槐」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "蔥「ㄙㄨㄢˋ」",
        "answer":  "蒜",
        "options":  [
                        "蒜",
                        "算",
                        "酸",
                        "祘"
                    ],
        "note":  "「蔥「ㄙㄨㄢˋ」」的正確答案是「蒜」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "雨後春「ㄙㄨㄣˇ」",
        "answer":  "筍",
        "options":  [
                        "筍",
                        "笋",
                        "損",
                        "荀"
                    ],
        "note":  "「雨後春「ㄙㄨㄣˇ」」的正確答案是「筍」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "「ㄔㄨㄣ」萱並茂",
        "answer":  "椿",
        "options":  [
                        "椿",
                        "春",
                        "樁",
                        "蓁"
                    ],
        "note":  "「「ㄔㄨㄣ」萱並茂」的正確答案是「椿」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "高「ㄌㄧㄤˊ」酒",
        "answer":  "粱",
        "options":  [
                        "粱",
                        "梁",
                        "糧",
                        "良"
                    ],
        "note":  "「高「ㄌㄧㄤˊ」酒」的正確答案是「粱」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "冒雨剪「ㄐㄧㄡˇ」",
        "answer":  "韭",
        "options":  [
                        "韭",
                        "久",
                        "玖",
                        "灸"
                    ],
        "note":  "「冒雨剪「ㄐㄧㄡˇ」」的正確答案是「韭」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "績麻拈「ㄓㄨˋ」",
        "answer":  "苧",
        "options":  [
                        "苧",
                        "佇",
                        "貯",
                        "杼"
                    ],
        "note":  "「績麻拈「ㄓㄨˋ」」的正確答案是「苧」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "草「ㄐㄧㄢ」人命",
        "answer":  "菅",
        "options":  [
                        "菅",
                        "管",
                        "箋",
                        "奸"
                    ],
        "note":  "「草「ㄐㄧㄢ」人命」的正確答案是「菅」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "田間「ㄅㄞˋ」草",
        "answer":  "稗",
        "options":  [
                        "稗",
                        "敗",
                        "拜",
                        "粺"
                    ],
        "note":  "「田間「ㄅㄞˋ」草」的正確答案是「稗」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "如火如「ㄊㄨˊ」",
        "answer":  "荼",
        "options":  [
                        "荼",
                        "茶",
                        "塗",
                        "途"
                    ],
        "note":  "「如火如「ㄊㄨˊ」」的正確答案是「荼」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "河畔青「ㄨˊ」",
        "answer":  "蕪",
        "options":  [
                        "蕪",
                        "無",
                        "巫",
                        "梧"
                    ],
        "note":  "「河畔青「ㄨˊ」」的正確答案是「蕪」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "青「ㄎㄜ」",
        "answer":  "稞",
        "options":  [
                        "稞",
                        "棵",
                        "科",
                        "顆"
                    ],
        "note":  "「青「ㄎㄜ」」的正確答案是「稞」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "「ㄓ」子花開",
        "answer":  "梔",
        "options":  [
                        "梔",
                        "枝",
                        "脂",
                        "肢"
                    ],
        "note":  "「「ㄓ」子花開」的正確答案是「梔」。"
    },
    {
        "round":  6,
        "type":  "pronunciation",
        "question":  "桑「榆」晚景的讀音",
        "answer":  "ㄩˊ",
        "options":  [
                        "ㄩˊ",
                        "ㄩˇ",
                        "ㄩˋ",
                        "ㄩ"
                    ],
        "note":  "「桑榆晚景」的「榆」讀作「ㄩˊ」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "「ㄡˇ」斷絲連",
        "answer":  "藕",
        "options":  [
                        "藕",
                        "偶",
                        "耦",
                        "嘔"
                    ],
        "note":  "「「ㄡˇ」斷絲連」的正確答案是「藕」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "一「ㄒㄩㄣ」一蕕",
        "answer":  "薰",
        "options":  [
                        "薰",
                        "熏",
                        "勳",
                        "醺"
                    ],
        "note":  "「一「ㄒㄩㄣ」一蕕」的正確答案是「薰」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "「ㄘㄨˋ」漿草",
        "answer":  "酢",
        "options":  [
                        "酢",
                        "醋",
                        "錯",
                        "措"
                    ],
        "note":  "「「ㄘㄨˋ」漿草」的正確答案是「酢」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "「ㄏㄨˋ」瓞綿綿",
        "answer":  "瓠",
        "options":  [
                        "瓠",
                        "互",
                        "戶",
                        "護"
                    ],
        "note":  "「「ㄏㄨˋ」瓞綿綿」的正確答案是「瓠」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "「ㄊㄢˊ」花一現",
        "answer":  "曇",
        "options":  [
                        "曇",
                        "壇",
                        "檀",
                        "談"
                    ],
        "note":  "「「ㄊㄢˊ」花一現」的正確答案是「曇」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "棕「ㄌㄩˊ」",
        "answer":  "櫚",
        "options":  [
                        "櫚",
                        "閭",
                        "驢",
                        "呂"
                    ],
        "note":  "「棕「ㄌㄩˊ」」的正確答案是「櫚」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "臺灣「ㄌㄨㄢˊ」樹",
        "answer":  "欒",
        "options":  [
                        "欒",
                        "巒",
                        "孿",
                        "攣"
                    ],
        "note":  "「臺灣「ㄌㄨㄢˊ」樹」的正確答案是「欒」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "朝鮮「ㄐㄧˋ」",
        "answer":  "薊",
        "options":  [
                        "薊",
                        "計",
                        "際",
                        "寄"
                    ],
        "note":  "「朝鮮「ㄐㄧˋ」」的正確答案是「薊」。"
    },
    {
        "round":  6,
        "type":  "shape",
        "question":  "「ㄒㄧㄢ」維植物",
        "answer":  "纖",
        "options":  [
                        "纖",
                        "鮮",
                        "仙",
                        "先"
                    ],
        "note":  "「「ㄒㄧㄢ」維植物」的正確答案是「纖」。"
    }
]
;

const REVIEW_DATA =
[
    {
        "round":  1,
        "title":  "第一回：美食有形",
        "subtitle":  "第 1 回複習"
    },
    {
        "round":  2,
        "title":  "第二回：美食之音",
        "subtitle":  "第 2 回複習"
    },
    {
        "round":  3,
        "title":  "第三回：自然景觀",
        "subtitle":  "第 3 回複習"
    },
    {
        "round":  4,
        "title":  "第四回：蟲蟲危機",
        "subtitle":  "第 4 回複習"
    },
    {
        "round":  5,
        "title":  "第五回：使物鼓事盡衝",
        "subtitle":  "第 5 回複習"
    },
    {
        "round":  6,
        "title":  "第六回：種花植草",
        "subtitle":  "第 6 回複習"
    }
]
;

// 舊版除錯大作戰保留名稱；目前六組打怪模式直接使用 RAW_SHEET_DATA。
const GAME_WORDS_DATABASE = [];
