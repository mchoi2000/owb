# Download project files from your remote repo (after forking from the OWB marketplace master project)

```sh
$ git clone git@github.ibm.com:[repo_name]/operator-workbench.git
```

# Change directory to the downloaded project

```sh
$ cd operator-workbench
```

# List branches

```sh
$ git branch -v
```

# Create a new branch and name it with the RTC story# that you are going to work on, and immediately switch to the branch

```sh
$ git checkout -b [branch_name]
```

# Make changes

# Add changes to the current branch

```sh
$ git add [filename]
```

# Commit changes

```sh
$ git commit -m "list changes you made"
```

# Merge branch to local master

```sh
$ git merge [branch_name]
```

# List names (alias) of remote repositories

```sh
$ git remote -v
```

# Push your changes to a remote repository

```sh
$ git push [repo_alias] master
```

# Make a pull request on github web GUI
