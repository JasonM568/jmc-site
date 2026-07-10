/**
 * ────────────────────────────────────────────────────────────
 *  餐點登記表 — 菜單設定
 * ────────────────────────────────────────────────────────────
 *
 *  ▶ 這裡就是「菜單」的唯一來源，把下面的範例換成你的實際菜單即可，
 *    網頁上的勾選欄位會自動跟著更新，不需要改其他檔案。
 *
 *  每一個分類（category）底下放若干餐點（items）：
 *    - id    ：唯一代碼，英數即可，別重複（送出時會用到）
 *    - name  ：餐點名稱（顯示在勾選欄位）
 *    - price ：價格，選填。不想顯示價格就整個拿掉這個欄位
 *    - desc  ：備註 / 說明，選填（例如「附紅茶」「素食」）
 *
 *  分類名稱（category）可自由命名，例如：主餐、飲料、加點、素食……
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
  title: "餐點登記表",
  subtitle: "請填寫姓名與電話，並勾選要訂的餐點，送出後我們會收到你的登記。",
  /** 是否顯示價格與金額小計（菜單沒有價格就設成 false） */
  showPrices: true,
  /** 幣別符號 */
  currency: "$",
};

/**
 * ⚠️ 以下為「範例菜單」，請整段替換成你上傳的實際菜單內容。
 */
export const menu: MenuCategory[] = [
  {
    category: "主餐",
    items: [
      { id: "main-braised-pork", name: "招牌滷肉飯", price: 60, desc: "附半熟蛋" },
      { id: "main-chicken-rice", name: "香煎雞腿飯", price: 110 },
      { id: "main-beef-noodle", name: "紅燒牛肉麵", price: 130 },
      { id: "main-veg-set", name: "時蔬蛋炒飯", price: 90, desc: "素食可" },
    ],
  },
  {
    category: "配菜 / 加點",
    items: [
      { id: "side-egg", name: "滷蛋", price: 15 },
      { id: "side-tofu", name: "滷豆干", price: 20 },
      { id: "side-veg", name: "燙青菜", price: 30 },
    ],
  },
  {
    category: "飲料",
    items: [
      { id: "drink-black-tea", name: "古早味紅茶", price: 25 },
      { id: "drink-green-tea", name: "冬瓜青茶", price: 30 },
      { id: "drink-latte", name: "鮮奶茶", price: 45 },
    ],
  },
];
