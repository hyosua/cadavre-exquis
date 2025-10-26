#!/bin/bash
# run
# run server & client 

(cd server && npm run dev) & 
(cd client && npm run dev) &
wait