"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Dialog as BaseUIDialog,
  type ComponentRenderFn,
  type DialogTriggerState,
  type HTMLProps,
} from "@base-ui/react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { toast } from "~/components/ui/toast";

import { BookmarkForm, type BookmarkFormValues } from "./bookmark-form";
import { useState, type JSXElementConstructor, type ReactElement } from "react";

export interface CreateBookmarkDialogProps {
  children?:
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | ComponentRenderFn<HTMLProps, DialogTriggerState>;
}

export const CreateBookmarkDialog: React.FC<CreateBookmarkDialogProps> = ({
  children,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dialog = BaseUIDialog.createHandle();

  const createBookmarkMutation = api.bookmark.create.useMutation({
    onSuccess: () => {
      dialog.close();
      toast.add({
        title: "Success",
        description: "ブックマークを作成しました",
        type: "success",
      });
      router.refresh();
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message,
        type: "error",
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = async (values: BookmarkFormValues) => {
    try {
      setLoading(true);
      await createBookmarkMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error creating bookmark:", error);
    }
  };

  return (
    <Dialog handle={dialog}>
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ブックマークを追加</DialogTitle>
        </DialogHeader>
        <BookmarkForm id="create-bookmark-form" onSubmit={handleSubmit} />
        <DialogFooter>
          <DialogClose render={<Button variant="outline">キャンセル</Button>} />
          <Button type="submit" form="create-bookmark-form" disabled={loading}>
            {loading && <Spinner data-icon="inline-start" />}
            作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
