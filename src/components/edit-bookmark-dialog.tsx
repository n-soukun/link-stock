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
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { toast } from "~/components/ui/toast";

import { BookmarkForm, type BookmarkFormValues } from "./bookmark-form";
import { useState } from "react";

export interface EditBookmarkDialogProps {
  bookmarkId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditBookmarkDialog: React.FC<EditBookmarkDialogProps> = ({
  bookmarkId,
  open,
  onOpenChange,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const getBookmarkQuery = api.bookmark.getById.useQuery({ id: bookmarkId });
  const editBookmarkMutation = api.bookmark.update.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      toast.add({
        title: "Success",
        description: "ブックマークを更新しました",
        type: "success",
      });
      router.refresh();
      getBookmarkQuery.refetch();
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
      await editBookmarkMutation.mutateAsync({
        id: bookmarkId,
        title: values.title,
        url: values.url,
        memo: values.memo,
      });
    } catch (error) {
      console.error("Error creating bookmark:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ブックマークを編集</DialogTitle>
        </DialogHeader>
        {getBookmarkQuery.isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner />
          </div>
        ) : getBookmarkQuery.isError ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-red-500">ブックマークの取得に失敗しました</p>
          </div>
        ) : (
          <BookmarkForm
            id="edit-bookmark-form"
            defaultValues={{
              title: getBookmarkQuery.data?.title ?? "",
              url: getBookmarkQuery.data?.url ?? "",
              memo: getBookmarkQuery.data?.memo ?? "",
            }}
            onSubmit={handleSubmit}
          />
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline">キャンセル</Button>} />
          <Button type="submit" form="edit-bookmark-form" disabled={loading}>
            {loading && <Spinner data-icon="inline-start" />}
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
