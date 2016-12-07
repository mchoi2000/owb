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

# Add updated files to the current branch

```sh
$ git add [file1] [file2] [file3]
```

# Add all changes to the current branch at once

```sh
$ git add .
```

# List changes

```sh
$ git status
```

# Commit changes

```sh
$ git commit -m "description of changes that you made"
```

# List branches

```sh
$ git branch
```

# Checkout master

```sh
$ git checkout master
```

# Merge branch to master

```sh
$ git merge [branch_name]
```

# List names (alias) of remote repositories

```sh
$ git remote -v
```

# Push your changes to remote repository

```sh
$ git push origin master
```

# Make a pull request manually on github web GUI
