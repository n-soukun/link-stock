"use client";

import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const bookmarkFormSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  url: z.string().url({ message: "有効なURLを入力してください" }),
  memo: z.string(),
});

export type BookmarkFormValues = z.infer<typeof bookmarkFormSchema>;

export interface BookmarkFormProps {
  id?: string;
  defaultValues?: BookmarkFormValues;
  onSubmit?: (values: BookmarkFormValues) => void;
}

export const BookmarkForm: React.FC<BookmarkFormProps> = ({
  id,
  defaultValues,
  onSubmit,
}) => {
  const form = useForm({
    defaultValues: defaultValues ?? {
      title: "",
      url: "",
      memo: "",
    },
    validators: {
      onSubmit: bookmarkFormSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit?.(value);
    },
  });
  return (
    <form
      id={id ?? "bookmark-form"}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>タイトル</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  placeholder="新しいブックマーク"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="url"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  placeholder="https://example.com"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
        <form.Field
          name="memo"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>メモ</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  placeholder="メモを入力"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
};
