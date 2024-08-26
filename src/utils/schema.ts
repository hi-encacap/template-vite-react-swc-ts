import dayjs from "dayjs";
import { StringSchema, number as yupNumber, string as yupString } from "yup";

import { FormatMessage } from "@interfaces/common";

interface StringParam {
  required?: true;
}

type StringSchemaType<T extends StringParam> = T["required"] extends true
  ? StringSchema<string>
  : StringSchema;

const string = <T extends StringParam>(t: FormatMessage, options: T = {} as T): StringSchemaType<T> => {
  let schema = yupString().typeError(t({ id: "please_enter_the_valid_string_d" }));

  if (options.required) {
    schema = schema.required(t({ id: "please_enter_this_field_d" }));
  }

  return schema as StringSchemaType<T>;
};

export const number = () => {
  return yupNumber().transform((value: unknown) => (value || value === 0 ? value : undefined));
};

const getSchema = (t: FormatMessage) => ({
  string: (params?: StringParam) => string(t, params),
  // number: (params?: StringParam) => number(t, params),
});

export const getMessage = (t: FormatMessage) => ({
  invalid_string: t({ id: "please_enter_the_valid_string_d" }),
  required: t({ id: "please_enter_this_field_d" }),
  required_select: t({ id: "please_select_this_field_d" }),
  invalid_number: t({ id: "please_enter_the_valid_number_d" }),
  invalid_email: t({ id: "please_enter_the_valid_email_d" }),
  min: ({ min }: { min: number }) => t({ id: "please_enter_at_least_min_d" }, { min }),
  max_date: ({ max }: { max: string | Date }) =>
    t({ id: "please_enter_at_most_max_d" }, { max: dayjs(max).format(t({ id: "date_format" })) }),
  max: ({ max }: { max: number | string }) => t({ id: "please_enter_at_most_max_d" }, { max }),
});

export const isValidPhone = (value?: string) => {
  if (!value) return true;

  const phoneRegex = /^(0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9(\d)))(\d{7})$/;

  return phoneRegex.test(value);
};

export default getSchema;
