// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/shared/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");
      return { userId: (session.user as any).userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save avatar URL to DB
      const { prisma } = await import("@/shared/lib/prisma");
      await prisma.user.update({
        where: { id: metadata.userId },
        data:  { avatarUrl: file.ufsUrl },
      });
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
