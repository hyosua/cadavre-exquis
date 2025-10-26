#!/bin/bash
# run
# run server & client on different terminals

(cd server && npm run dev) &
(cd client && npm run dev) &
wait
