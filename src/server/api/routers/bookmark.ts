import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const bookmarkRouter = createTRPCRouter({
  getUnread: protectedProcedure.query(async ({ ctx }) => {
    const bookmarks = await ctx.db.bookmark.findMany({
      where: { userId: ctx.session.user.id, isRead: false },
      orderBy: { createdAt: "desc" },
    });
    return bookmarks;
  }),
  getReaded: protectedProcedure.query(async ({ ctx }) => {
    const bookmarks = await ctx.db.bookmark.findMany({
      where: { userId: ctx.session.user.id, isRead: true },
      orderBy: { createdAt: "desc" },
    });
    return bookmarks;
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const bookmark = await ctx.db.bookmark.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      return bookmark;
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        url: z.string(),
        memo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.db.bookmark.create({
        data: {
          userId: ctx.session.user.id,
          title: input.title,
          url: input.url,
          memo: input.memo,
        },
      });
      return bookmark;
    }),
  updateIsRead: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isRead: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.db.bookmark.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: { isRead: input.isRead },
      });
      return bookmark;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        url: z.string(),
        memo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.db.bookmark.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: {
          title: input.title,
          url: input.url,
          memo: input.memo,
        },
      });
      return bookmark;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const bookmark = await ctx.db.bookmark.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
      return bookmark;
    }),
});
