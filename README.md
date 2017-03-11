# GWJ Enhancement Suite

Provides extra features for gamerswithjobs.com

## Developing

0. `npm i`
1. start webpack in watch mode `npm run build`
2. in a second console, inject into a clean firefox profile `npm run firefox-dev`
3. addon will live-reload as you save changes

## Building

1. lint the code and manifest `npm run lint`
2. TODO: support building an unsigned zip `npm run dist-build && cd addon && web-ext build`

## TODO

- [ ] Import thread ignore script
- [ ] figure out data migration
- [ ] add upsell and collision avoidance to old userscripts
- [ ] test in chrome
- [ ] more UI in settings
- [ ] publish to extension stores
