/* ============================================================
   MELTED — Product Data
   ============================================================
   Edit this single file to update product names, prices,
   images and the WhatsApp order number.

   price  → number in Rupees
   image  → path relative to the HTML file that loads this script
   ============================================================ */

/* WhatsApp number for the "Order" buttons (international format, no +) */
var MELTED_WHATSAPP = '918140000244';

var MELTED_PRODUCTS = [

  /* ===========================================================
     CATEGORY A — Chocolate Covered Nuts  (40 gm boxes)
     =========================================================== */
  {
    id: 'almonds-chocolate',
    category: 'nuts',
    categoryLabel: 'Chocolate Covered Nuts',
    name: 'Roasted Almonds',
    flavour: 'Chocolate',
    weight: '40 gm',
    price: 50,
    image: 'images/products/almonds-chocolate.webp',
    alt: 'Melted chocolate covered roasted almonds, 40 gm box'
  },
  {
    id: 'almonds-rose',
    category: 'nuts',
    categoryLabel: 'Chocolate Covered Nuts',
    name: 'Roasted Almonds',
    flavour: 'Rose',
    weight: '40 gm',
    price: 60,
    image: 'images/products/almonds-rose.webp',
    alt: 'Melted rose flavour chocolate covered roasted almonds, 40 gm box'
  },
  {
    id: 'almonds-rose-petals',
    category: 'nuts',
    categoryLabel: 'Chocolate Covered Nuts',
    name: 'Roasted Almonds',
    flavour: 'Rose Petals',
    weight: '40 gm',
    price: 60,
    image: 'images/products/almonds-rose-petals.webp',
    alt: 'Melted rose petals flavour chocolate covered roasted almonds, 40 gm box'
  },
  {
    id: 'almonds-kesar',
    category: 'nuts',
    categoryLabel: 'Chocolate Covered Nuts',
    name: 'Roasted Almonds',
    flavour: 'Kesar',
    weight: '40 gm',
    price: 70,
    image: 'images/products/almonds-kesar.webp',
    alt: 'Melted kesar flavour chocolate covered roasted almonds, 40 gm box'
  },
  {
    id: 'cashew-chocolate',
    category: 'nuts',
    categoryLabel: 'Chocolate Covered Nuts',
    name: 'Roasted Cashew',
    flavour: 'Chocolate',
    weight: '40 gm',
    price: 60,
    image: 'images/products/cashew-chocolate.webp',
    alt: 'Melted chocolate covered roasted cashews, 40 gm box'
  },
  {
    id: 'raisins-orange',
    category: 'nuts',
    categoryLabel: 'Chocolate Covered Nuts',
    name: 'Raisins',
    flavour: 'Orange',
    weight: '40 gm',
    price: 45,
    image: 'images/products/raisins-orange.webp',
    alt: 'Melted orange flavour chocolate covered raisins, 40 gm box'
  },

  /* ===========================================================
     CATEGORY B — Bar Chocolate
     =========================================================== */

  /* ---- 25 gm bars ---- */
  {
    id: 'bar-25g-chocolate',
    category: 'bars',
    categoryLabel: 'Bar Chocolate',
    name: 'Milk Chocolate',
    flavour: 'Chocolate',
    weight: '25 gm',
    price: 35,
    image: 'images/products/bar-25g-chocolate.webp',
    alt: 'Melted milk chocolate bar, 25 gm'
  },
  {
    id: 'bar-25g-orange',
    category: 'bars',
    categoryLabel: 'Bar Chocolate',
    name: 'Orange Chocolate',
    flavour: 'Orange',
    weight: '25 gm',
    price: 40,
    image: 'images/products/bar-25g-orange.webp',
    alt: 'Melted orange chocolate bar, 25 gm'
  },
  {
    id: 'bar-25g-wafer-balls',
    category: 'bars',
    categoryLabel: 'Bar Chocolate',
    name: 'Wafer Balls Chocolate',
    flavour: 'Wafer Balls',
    weight: '25 gm',
    price: 40,
    image: 'images/products/bar-25g-wafer-balls.webp',
    alt: 'Melted wafer balls chocolate bar, 25 gm'
  },
  {
    id: 'bar-25g-oreo',
    category: 'bars',
    categoryLabel: 'Bar Chocolate',
    name: 'Oreo Chocolate',
    flavour: 'Oreo',
    weight: '25 gm',
    price: 45,
    image: 'images/products/bar-25g-oreo.webp',
    alt: 'Melted oreo chocolate bar, 25 gm'
  },

  /* ---- 65 gm bars ---- */
  {
    id: 'bar-65g-chocolate',
    category: 'bars',
    categoryLabel: 'Bar Chocolate',
    name: 'Milk Chocolate',
    flavour: 'Chocolate',
    weight: '65 gm',
    price: 75,
    image: 'images/products/bar-65g-chocolate.webp',
    alt: 'Melted milk chocolate bar, 65 gm'
  },
  {
    id: 'bar-65g-almond',
    category: 'bars',
    categoryLabel: 'Bar Chocolate',
    name: 'Almond Chocolate',
    flavour: 'Almond',
    weight: '65 gm',
    price: 90,
    image: 'images/products/bar-65g-almond.webp',
    alt: 'Melted almond chocolate bar, 65 gm'
  },
  {
    id: 'bar-65g-mix-nuts',
    category: 'bars',
    categoryLabel: 'Bar Chocolate',
    name: 'Mix Nuts Chocolate',
    flavour: 'Mix Nuts',
    weight: '65 gm',
    price: 100,
    image: 'images/products/bar-65g-mix-nuts.webp',
    alt: 'Melted mix nuts chocolate bar, 65 gm'
  },

  /* ===========================================================
     CATEGORY C — Chocolate Covered Wafer Balls  (20 gm boxes)
     =========================================================== */
  {
    id: 'wafer-balls-white',
    category: 'wafer-balls',
    categoryLabel: 'Chocolate Covered Wafer Balls',
    name: 'White Wafer Balls',
    flavour: 'White Chocolate',
    weight: '20 gm',
    price: 30,
    image: 'images/products/wafer-balls-white.webp',
    alt: 'Melted white chocolate covered wafer balls, 20 gm box'
  },
  {
    id: 'wafer-balls-dark',
    category: 'wafer-balls',
    categoryLabel: 'Chocolate Covered Wafer Balls',
    name: 'Dark Wafer Balls',
    flavour: 'Dark Chocolate',
    weight: '20 gm',
    price: 25,
    image: 'images/products/wafer-balls-dark.webp',
    alt: 'Melted dark chocolate covered wafer balls, 20 gm box'
  }
];
