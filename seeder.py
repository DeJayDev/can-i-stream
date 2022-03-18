import asyncio
import os
import tekore as tk
from peewee import *
from tekore import RetryingSender, AsyncSender
from dotenv import load_dotenv

load_dotenv()
database = PostgresqlDatabase('postgres', user='postgres', password=os.environ['DB_PASSWORD'], host='db.unorjcmmfhcaugdlzgio.supabase.co')

class BaseModel(Model):
    class Meta:
        database = database

class Artist(BaseModel):
    id = TextField(primary_key=True)
    name = TextField()
    proof = TextField(null=True)
    streamable = BooleanField(null=True)

    class Meta:
        table_name = 'Artist'

async def get_playlists_from_file():
    # Tekore has API for this, but, I don't really understand it.
    # Maybe if I switch to spotipy I'll have a better chance.
    playlists = list()
    with open('playlists.txt', 'r') as _playlists:
        for playlist in _playlists:
            # if the first character is #: skip the line
            if playlist[0] == '#':
                continue
            # extract youtube video id from link
            playlist_id = playlist.replace('https://open.spotify.com/playlist/', '')
            playlists.append(playlist_id.strip())
    return playlists


async def main() -> None:
    # This sender gives us the power to parallelize the requests
    # makes things go zoom.

    sender = RetryingSender(sender=AsyncSender())
    token = tk.request_client_token(os.environ['PY_CLIENT_ID'], os.environ['PY_CLIENT_SECRET'])
    spotify = tk.Spotify(token, sender=sender, max_limits_on=True)

    artists = list()
    playlists = await get_playlists_from_file() if not os.environ.get('DRY_RUN') == 'false' else list()
    for playlist_ids in playlists:
        if len(artists) > 0:
            print("Found {} artists".format(len(artists)))
        try:
            p = await spotify.playlist_items(playlist_ids, market='us')
            async for entry in spotify.all_items(p):
                if not entry.track or entry.is_local:
                    # Somethings wrong. Why? Not sure. How is a track OPTIONAL? A PLAYLIST IS A COLLECTION OF TRACKS.
                    # We're also hijacking this block to skip the song if it's a local entry.
                    break 
                if len(entry.track.artists) > 1:
                    for artist in entry.track.artists:
                        artists.append(artist)
                else:
                    artists.append(entry.track.artists[0])
        except tk.NotFound as e:
            print('404\'d while getting playlist with ID {}'.format(playlist_ids, e))

    with database.atomic():
        for artist in artists:
            print('Adding {} to database'.format(artist.name))
            Artist.insert(id=artist.id, name=artist.name).on_conflict_ignore().execute()

    print('All done! Added {} artists to database'.format(len(artists)))


if __name__ == '__main__':
    asyncio.run(main())
