import { Artist } from "@prisma/client";
import type { LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";

import { db } from "~/utils/db.server";

type LoaderData = {
  artist: Artist | null;
};

export const loader: LoaderFunction = async ({params}) => {
  const data: LoaderData = {
    artist: await db.artist.findUnique({
      where: { id: params.artist },
    }),
  };
  return json(data);
};

export default function ArtistRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Paramaterized Route - Data for {data.artist?.name}</p>
      <p>
        You <strong>{(data.artist?.streamable ? "can" : data.artist?.streamable ? "can not" : "PROBABLY")}</strong> stream {data.artist?.name}
        <br/>
        <sup>{data.artist?.proof}</sup>
      </p>
    </div>
  );
}