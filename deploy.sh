#!/bin/bash
git checkout master
git pull
npm run docs:build
scp -r ./docs/.vuepress/dist/. root@139.196.82.33:/webSrc/dist