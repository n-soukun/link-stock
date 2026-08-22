import { auth } from "~/server/auth";

import { Header } from "~/components/header";
import { BookmarkList } from "~/components/bookmark-list";
import { Welcome } from "~/components/welcome";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <Header user={session?.user} />
      {session?.user ? <BookmarkList /> : <Welcome />}
    </>
  );
}
