# geover
Version control tool (similar to Git), but for Geometry Dash.

# Usage
## Client Usage
- Install [SPWN](https://github.com/Spu7Nix/SPWN-language).
- Clone this repo.
- Run `spwn build client/main.spwn --allow http_request`
- Enter info
- Find Geover server URL & paste it
- Use commands listed below

## Commands
- `push username/repo_name` - Pushes to a repo
- `init repo_name` - Initiate a repository
- `invite username` - Invite user to your repo
- `fetch username/repo_name` - writes repo to GD savefile

## Hosting a server (for developers)
- Clone this repo.
- CD into `server`
- Run `npm i && node .`
