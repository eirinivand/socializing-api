# User Messages API

## Development environment
In order to run application use:
      `docker-compose up`


## API endpoints
- `/feedDB` endpoint: Saves users and messages from seeds.xlsx
  - The id's of the spreadsheet are preserved.
- `/users` endpoint: Retrieves users from database, using filters.
  - Filters are the fields of users table.
  - Also when a prefix `l_` is added to the field, it makes the filter to search for any field values that include the given value.
  - Lastly `i_` prefix makes the filter to require exact word match, but case Insensitive
- `/chats/between/<userId1>-<userId1>` endpoint: Retrieves messages based on parameters
  - When given params `userId1` and `userdId2` it retrieves all exchanged messages between them, ordered by most recent.
  - i.e. `/chats/between/1-2`
- `/chats/of/<userId>` When given one path param of a user's id it fetches all user's messages.
  - i.e. `/chats/of/1`
