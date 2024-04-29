export const currencies = [
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
  { value: "USD", label: "$ Dollar", locale: "en-US" },
];

export type Currency = (typeof currencies)[0];
