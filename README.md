# Operator Workbench Project Setup Guide

[![Build Status](https://travis.innovate.ibm.com/digital-marketplace/operator-workbench.svg?token=seVCezF9zYwaDU6Z2NDz&branch=master)](https://travis.innovate.ibm.com/digital-marketplace/operator-workbench)

# Project Goal

Deliver an unified operator tool for 1st and 3rd party offerings that provide self-service management features according to the user roles defined for on-boarding, globalizing, and merchandising marketplace offerings on IBM Marketplace. A marketplace operator is defined as an user who reviews, analyzes, and acts on marketplace assets provided by the marketplace providers and marketplace stakeholders.

# Tools and Links

1. [AngularJS][Link to AngularJS] - Client side web application framework
2. [NodeJS][Link to NodeJS] - Non-Blocking I/O and Event based Javascript runtime
3. [Homebrew][Link to Homebrew] - Package manager for OS X
4. [Production environment][Link to production] - where the code gets deployed
5. [RTC][Link to RTC] - Tasking and Sprint management.
6. [Design Community][Link to Design Community] - The community that the design team is using for documentation of their work.
7. IDE - Pick an editor of your choice.  
       Atom - Current IDE of choice.  Has good editing plugins, but not much for command line integration.  
       ​WebStorm - Javascript and Web App IDE.  Needs a license after a trial period.  
       Sublime - Another editor that's good for Javascript and Web Apps. Also needs a license after a trial period.

# Setting up the operator-workbench Project

Before beginning to clone the repository, make sure you have installed the following
1. Install [Git][Link to Git Download]
    - Install the application and then click on the 'Install command line tools' in the application preferences. This will install the command line git tools and make you install xcode tools, which make installation a little cleaner/easier on a mac.
    - Once the command line tools are installed you can continue with some of the config steps below.
2. Install [NodeJS][Link to NodeJS Download]
3. Github access to [operator-workbench Repository][Link to Github operator-workbench]

## Setting up Git

Open Git Bash on terminal app (not the Git GUI)

1. Have a look at your configuration variables
   ```sh
   git config -l
   ```
2. Set up your Username and Email
   ```sh
   git config --global user.email "your_ibm_username@us.ibm.com"
   git config --global user.name "your_ibm_username"
   ```
3. Generate a new [SSH Key][Link to generate ssh key]

## Cloning the repository from Github

1. Fork from the operator-workbench project (https://github.ibm.com/digital-marketplace/operator-workbench)

2. Clone your github repository
   ```sh
   git clone https://github.ibm.com/[your_repo]/operator-workbench
   ```

3. Open operator-workbench folder in Git Bash
   ```sh
   cd operator-workbench
   ```
>On list the folder contents you must be able to see many directories including 'app' and 'test' and files like 'gulpfile.js' and 'package.json'

4. Check Node version (node -v). v6.9.1 is required for operator-workbench project. To install/update Node:

   Clean npm cache
   ```sh
   npm cache clean -f
   ```
   Install n tool
   ```sh
   npm install -g n
   ```
   Install node.js v6.9.1
   ```sh
   sudo n 6.9.1
   ```

5. Install  global npm packages
    bower - Package manager for web app dependencies,   
    gulp - Build framework  
    karma - Test Runner

   ```sh
   npm install -g bower
   npm install -g gulp
   npm install -g karma
   ```

6. Install all required dependencies
   ```sh
   npm install
   ```
   >It takes a couple of minutes to complete. Wait. Wait. Wait.


7. Follow the instructions in docs/openssl.md to setup openssl


8. Set the local environment variables (local.env.json from tech lead) and place it under server/config/

9. Run the project
   ```sh
   gulp serve
   ```
   >This command runs a task named 'serve' defined in the gulpfile.js

## Making changes to the repository

1. Create a branch for Git using (can also use the github application)
   ```sh
   git checkout -b <branch_name>
   ```
2. Refer to /docs/git_commands.md for more git commands
3. In the Github Gui, commit your changes including a brief descriptive message containing the feature request #.
4. Press the pull request button.
5. Press the publish button.


## Connecting to db : couchdb (below) or cloudant (cloudant.com)

1. Download CouchDB 2.0.0 MacOS version from [here](https://dl.bintray.com/apache/couchdb/mac/2.0.0/Apache-CouchDB-2.0.0.zip)

2. Unzip the file and drag & drop to your applications folder

3. Right-click the icon and click open. (You might have to click `Allow` on a couple of prompts asked)

4. Voila! CouchDB is running at [localhost:5894](http://127.0.0.1:5984/_utils/)

Licensed Materials - Property of IBM

@ Copyright IBM Corp. 2016 All Rights Reserved

US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.


[Link to Git Download]: https://central.github.com/mac/latest
[Link to NodeJS Download]: https://nodejs.org/download/
[Link to Github operator-workbench]: https://github.ibm.com/digital-marketplace/operator-workbench
[Link to AngularJS]: https://angularjs.org/
[Link to NodeJS]: https://nodejs.org/
[Link to Homebrew]: http://brew.sh/
[Link to production]: https://wwwpoc.ibm.com/marketplace/next/workbench
[Link to generate ssh key]: https://help.github.com/enterprise/2.2/user/articles/generating-ssh-keys/
[Link to RTC]: https://rtp-rtc9.tivlab.raleigh.ibm.com:9443/jazz/web
[Link to WebSphere Portal Documentation]: http://www.ibm.com/support/knowledgecenter/SSHRKX_8.5.0/welcome/wp_welcome.html
[Link to Design Community]: https://apps.na.collabserv.com/communities/service/html/communitystart?communityUuid=aecb7c73-2c00-46e6-985c-cca9c1e2c105
