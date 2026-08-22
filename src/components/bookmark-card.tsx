"use client";

import type { Bookmark } from "generated/prisma";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "./ui/toast";
import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
import { EditBookmarkDialog } from "./edit-bookmark-dialog";
import { useState } from "react";

export interface BookmarkCardProps {
  bookmark: Bookmark;
}

export const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark }) => {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleEditDialogOpenChange = (open: boolean) => {
    setEditDialogOpen(open);
  };

  const updateIsReadMutation = api.bookmark.updateIsRead.useMutation({
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: `ブックマークを${bookmark.isRead ? "未読" : "既読"}にしました`,
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
  });

  const deleteBookmarkMutation = api.bookmark.delete.useMutation({
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "ブックマークを削除しました",
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
  });

  const handleMarkAsRead = async () => {
    try {
      await updateIsReadMutation.mutateAsync({ id: bookmark.id, isRead: true });
    } catch (error) {
      console.error("Error marking bookmark as read:", error);
    }
  };

  const handleMarkAsUnread = async () => {
    try {
      await updateIsReadMutation.mutateAsync({
        id: bookmark.id,
        isRead: false,
      });
    } catch (error) {
      console.error("Error marking bookmark as unread:", error);
    }
  };

  const handleDeleteBookmark = async () => {
    try {
      await deleteBookmarkMutation.mutateAsync({ id: bookmark.id });
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{bookmark.title}</CardTitle>
        <CardDescription>
          <Link
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {bookmark.url}
          </Link>
        </CardDescription>
        <CardAction className="flex gap-2">
          {!bookmark.isRead && (
            <Button onClick={handleMarkAsRead}>既読にする</Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button size="icon" variant="outline" />}
            >
              <EllipsisVerticalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {bookmark.isRead && (
                  <DropdownMenuItem onClick={handleMarkAsUnread}>
                    未読にする
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={handleOpenEditDialog}>
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDeleteBookmark}
                >
                  削除
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      {bookmark.memo && (
        <CardContent>
          <p>{bookmark.memo}</p>
        </CardContent>
      )}
      <EditBookmarkDialog
        bookmarkId={bookmark.id}
        open={editDialogOpen}
        onOpenChange={handleEditDialogOpenChange}
      />
    </Card>
  );
};
