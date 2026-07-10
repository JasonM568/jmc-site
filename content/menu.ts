/**
 * ────────────────────────────────────────────────────────────
 *  品馨牛排 — 點餐登記菜單設定
 * ────────────────────────────────────────────────────────────
 *
 *  ▶ 這裡是「菜單」的唯一來源，改這個檔案就能更新網頁上的勾選欄位，
 *    不需要改其他檔案。
 *
 *  每一個分類（category）底下放若干餐點（items）：
 *    - id    ：唯一代碼，英數即可，別重複（送出時會用到）
 *    - name  ：餐點名稱（顯示在勾選欄位）
 *    - price ：價格，選填。不想顯示價格就整個拿掉這個欄位
 *    - desc  ：備註 / 說明，選填（例如產地、份量、推薦）
 */

export type MenuItem = {
  id: string;
  name: string;
  price?: number;
  desc?: string;
};

export type MenuCategory = {
  category: string;
  items: MenuItem[];
};

/** 登記表標題與說明（顯示在頁面最上方） */
export const menuMeta = {
  title: "品馨牛排・點餐登記",
  subtitle:
    "請填寫姓名與電話，並勾選要點的餐點，送出後我們會收到你的登記。加肉／小點需搭配一份排餐加購（鐵板麵除外）。",
  /** 是否顯示價格與金額小計 */
  showPrices: true,
  /** 幣別符號 */
  currency: "$",
};

export const menu: MenuCategory[] = [
  {
    category: "經典排餐",
    items: [
      { id: "grill-teppan-noodle", name: "鐵板麵", price: 79, desc: "經典中的經典，搭配品馨醬汁" },
      { id: "grill-pork", name: "品馨豬排", price: 129, desc: "產地台灣・經典豬排，物超所值" },
      { id: "grill-beef", name: "品馨牛排", price: 139, desc: "產地澳洲・經典牛排，物超所值" },
      { id: "grill-chicken", name: "品馨雞腿排", price: 179, desc: "產地台灣・脆皮雞腿排，外酥內嫩" },
      { id: "grill-thick-pork", name: "厚重豬排", price: 199, desc: "產地台灣・每日新鮮直送，鮮嫩多汁" },
      { id: "grill-sirloin", name: "厚片沙朗", price: 209, desc: "產地澳洲・大理石油花，鮮美多汁" },
      { id: "grill-matsusaka-pork", name: "嚴選松阪豬排", price: 309, desc: "產地台灣・迷人油花與口感" },
      { id: "grill-ribeye-5oz", name: "美國頂級翼板牛排 5oz", price: 289, desc: "產地美國" },
      { id: "grill-ribeye-10oz", name: "美國頂級翼板牛排 10oz", price: 429, desc: "產地美國" },
      { id: "grill-flatiron-7oz", name: "美國頂級板腱牛排 7oz", price: 289, desc: "產地美國" },
      { id: "grill-flatiron-14oz", name: "美國頂級板腱牛排 14oz", price: 489, desc: "產地美國" },
    ],
  },
  {
    category: "品馨海線必吃",
    items: [
      { id: "sea-squid-steak", name: "嚴選魷魚排", price: 169, desc: "新鮮海味，鮮甜可口" },
      { id: "sea-seabass", name: "活菌無毒鱸魚排", price: 279, desc: "產地台灣・活菌無毒養殖，有產銷履歷" },
      { id: "sea-shrimp-noodle", name: "蝦麵給你吃（10隻）", price: 309, desc: "職人手工去殼，外酥內多汁，主廚推薦" },
      { id: "sea-milkfish", name: "比臉大虱目魚", price: 319, desc: "產地台灣・職人去刺，富含 DHA、EPA、鈣、磷、鐵" },
      { id: "sea-big-squid", name: "深海大魷魚", price: 399, desc: "嚴選深海大魷魚，厚實肉質，鮮嫩Q彈" },
      { id: "sea-squid-scallop-set", name: "深海大魷魚干貝海鮮組", price: 599, desc: "深海大魷魚×1 + 干貝×2 + 花枝丸×2" },
    ],
  },
  {
    category: "超值雙拼・加肉（需搭配排餐加購，鐵板麵除外）",
    items: [
      { id: "add-chicken", name: "品馨雞腿排", price: 139 },
      { id: "add-thick-pork-1", name: "厚重豬排（1片）", price: 99 },
      { id: "add-thick-pork-2", name: "厚重豬排（2片）", price: 159 },
      { id: "add-thick-beef", name: "厚片牛排", price: 169 },
      { id: "add-oyster", name: "焗烤日本大生蠔（2顆）", price: 199 },
      { id: "add-white-shrimp", name: "無毒免剝殼白蝦（10隻）", price: 209 },
      { id: "add-milkfish-belly", name: "比臉大虱目魚肚", price: 229 },
      { id: "add-big-squid", name: "深海大魷魚", price: 299 },
      { id: "add-pork-knuckle", name: "德國豬腳", price: 539 },
      { id: "add-duck-breast", name: "法式舒肥鴨胸", price: 539 },
      { id: "add-half-chicken", name: "香草烤半雞", price: 539 },
    ],
  },
  {
    category: "加購小點",
    items: [
      { id: "side-egg", name: "蛋", price: 15 },
      { id: "side-rice", name: "白飯", price: 15 },
      { id: "side-soup", name: "濃湯", price: 29, desc: "外帶" },
      { id: "side-tofu", name: "鐵板豆腐", price: 79 },
      { id: "side-seafood-soup", name: "海鮮酥皮濃湯", price: 79, desc: "內用限定" },
      { id: "side-milkfish-ice", name: "虱在好冰", price: 79, desc: "虱目魚頭造型冰棒" },
    ],
  },
];
