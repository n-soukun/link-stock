import { api } from "~/trpc/server";

import { BookmarkCard } from "~/components/bookmark-card";
import { CreateBookmarkDialog } from "~/components/create-bookmark-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { BookmarkIcon } from "lucide-react";

export const BookmarkList: React.FC = async () => {
  const unreadBookmarks = await api.bookmark.getUnread();
  const readedBookmarks = await api.bookmark.getReaded();

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <Tabs defaultValue="unread">
        <TabsList>
          <TabsTrigger value="unread">未読</TabsTrigger>
          <TabsTrigger value="readed">既読</TabsTrigger>
        </TabsList>
        <TabsContent value="unread">
          {unreadBookmarks.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookmarkIcon />
                </EmptyMedia>
                <EmptyTitle>No data</EmptyTitle>
                <EmptyDescription>
                  未読のブックマークはありません
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <CreateBookmarkDialog>
                  <Button>ブックマークを追加</Button>
                </CreateBookmarkDialog>
              </EmptyContent>
            </Empty>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>全{unreadBookmarks.length}件</div>
                <CreateBookmarkDialog>
                  <Button>ブックマークを追加</Button>
                </CreateBookmarkDialog>
              </div>
              <div className="flex flex-col gap-4">
                {unreadBookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="readed">
          {readedBookmarks.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BookmarkIcon />
                </EmptyMedia>
                <EmptyTitle>No data</EmptyTitle>
                <EmptyDescription>
                  既読のブックマークはありません
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <CreateBookmarkDialog>
                  <Button>ブックマークを追加</Button>
                </CreateBookmarkDialog>
              </EmptyContent>
            </Empty>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>全{readedBookmarks.length}件</div>
                <CreateBookmarkDialog>
                  <Button>ブックマークを追加</Button>
                </CreateBookmarkDialog>
              </div>
              <div className="flex flex-col gap-4">
                {readedBookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
