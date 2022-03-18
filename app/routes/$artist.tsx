import { Artist } from "@prisma/client";
import type { LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";

import { db } from "~/utils/db.server";

type LoaderData = {
  artist: Artist | null;
};

export const loader: LoaderFunction = async ({request}) => {
  const url = new URL(request.url)
  const query = url.searchParams.get("query")
  if (query == null || query === "") {
    return []
  }
  const data: LoaderData = {
    artist: await db.artist.findFirst({
      where: { name: query },
    }),
  };
  return json(data);
};

export default function ArtistRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="index flex flex-col h-full w-full justify-center items-center">
      <h1 className="text-4xl pb-3">Can I stream {data.artist?.name}...</h1>
      <p className="text-2xl text-center">
        {(data.artist?.streamable ? "YES" : data.artist?.streamable ? "NO" : "MAYBE!")}
        <br/>
        <a href={"https://open.spotify.com/artist/" + data.artist?.id}>
          <p className="text-sm pt-1">PS: Here's a link to their Spotify</p>
        </a>
      </p>
    </div>
  );
}