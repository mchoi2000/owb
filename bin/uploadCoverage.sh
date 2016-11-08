#!/bin/bash

# Upload Coverage Report

git config --global user.email "pkadiya@travis.innovate.ibm.com"
git config --global user.name "Travis CI"

wbClientCoverageReport="../../operator-workbench/reports/coverage/report-combined/lcov-report"

# Clone gh-pages branch into separate dir
cd ..
rm -rf ghpagesRepo
mkdir ghpagesRepo
cd ghpagesRepo
git clone --branch=gh-pages git@github.ibm.com:digital-marketplace/operator-wb-playbacks.git
cd operator-wb-playbacks

# Clean up old coverage report
rm -rf ./coverage
mkdir coverage

# Copy in new coverage report
cp -r $wbClientCoverageReport coverage

# Push new coverage report to gh-pages branch
git add -A
git commit -m "'[ci skip] Uploaded coverage report'"
git push origin gh-pages
