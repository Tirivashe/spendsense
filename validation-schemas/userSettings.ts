import { currencies } from "@/lib/currencies";
import { z } from "zod";
export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const foundCurrency = currencies.find((c) => c.value === value);
    if (!foundCurrency) throw new Error(`Invalid currency, ${value}`);
    return value;
  }),
});
