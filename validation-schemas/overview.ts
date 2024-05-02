import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import dayjs from "dayjs";
import { z } from "zod";
export const OverviewQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine(({ from, to }) => {
    const days = dayjs(to).diff(from, "day");
    return days >= 0 && days <= MAX_DATE_RANGE_DAYS;
  });

export type OverviewQuerySchemaType = z.infer<typeof OverviewQuerySchema>;
