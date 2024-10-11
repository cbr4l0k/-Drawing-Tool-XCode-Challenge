# deploy.yml 

The `deploy.yml` file is a GitHub Actions workflow configuration that automates the process of building and deploying our drawing application to GitHub Pages. This document will explain the file's content, structure, keywords, and the process of creating such a workflow.

## Full deploy.yml Content

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout 🛎️
      uses: actions/checkout@v4

    - name: Setup Node.js ⚙️
      uses: actions/setup-node@v4
      with:
        node-version: '22.9' 

    - name: Cache dependencies ⚡
      uses: actions/cache@v3
      with:
        path: ~/.npm
        key: ${{ runner.OS }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.OS }}-node-

    - name: Install Dependencies 🔧
      run: npm ci

    - name: Build 🏗️
      run: npm run build
      env:
        NEXT_PUBLIC_BASE_PATH: /Drawing-Tool-XCode-Challenge

    - name: Setup Pages ⚙️
      uses: actions/configure-pages@v4

    - name: Upload artifact 📡
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./out

    - name: Deploy to GitHub Pages 🚀
      id: detloyment
      uses: actions/deploy-pages@v4
```

## Structure and Keywords Explanation

1. **name**: 
   ```yaml
   name: Deploy to GitHub Pages
   ```
   This defines the name of the workflow, which will be displayed in the GitHub Actions tab.

2. **on**:
   ```yaml
   on:
     push:
       branches: [ "main" ]
     pull_request:
       branches: [ "main" ]
   ```
   This section defines the events that trigger the workflow. In this case, it's triggered on pushes to the main branch and on pull requests targeting the main branch.

3. **permissions**:
   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```
   This specifies the permissions granted to the workflow. It needs read access to the repository contents, and write access to GitHub Pages and the OIDC token.

4. **jobs**:
   ```yaml
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
   ```
   This section contains the jobs that make up the workflow. Here, we have a single job named `build-and-deploy` that runs on the latest Ubuntu runner.

5. **steps**:
   Each step in the job is defined under the `steps` key. For example:
   ```yaml
   steps:
     - name: Checkout 🛎️
       uses: actions/checkout@v4
   ```
   This step uses the `actions/checkout@v4` action to check out the repository code.

6. **uses** and **with**:
   ```yaml
   - name: Setup Node.js ⚙️
     uses: actions/setup-node@v4
     with:
       node-version: '22.9' 
   ```
   The `uses` keyword runs a pre-defined action. The `with` keyword provides input parameters for the action.

7. **run**:
   ```yaml
   - name: Install Dependencies 🔧
     run: npm ci
   ```
   The `run` keyword executes shell commands directly.

8. **env**:
   ```yaml
   - name: Build 🏗️
     run: npm run build
     env:
       NEXT_PUBLIC_BASE_PATH: /Drawing-Tool-XCode-Challenge
   ```
   The `env` keyword sets environment variables for a step.

## Relevant Patterns

1. **Caching Dependencies**:
   ```yaml
   - name: Cache dependencies ⚡
     uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.OS }}-node-${{ hashFiles('**/package-lock.json') }}
       restore-keys: |
         ${{ runner.OS }}-node-
   ```
   This step caches npm dependencies to speed up future workflow runs.

2. **Environment Variables**:
   ```yaml
   env:
     NEXT_PUBLIC_BASE_PATH: /Drawing-Tool-XCode-Challenge
   ```
   Setting environment variables allows for configuration specific to the GitHub Pages deployment.

3. **Artifact Upload and Deployment**:
   ```yaml
   - name: Upload artifact 📡
     uses: actions/upload-pages-artifact@v3
     with:
       path: ./out

   - name: Deploy to GitHub Pages 🚀
     id: detloyment
     uses: actions/deploy-pages@v4
   ```
   These steps upload the build output as an artifact and then deploy it to GitHub Pages.

## Process of Creating the Workflow

1. **Understanding the Application**: Identify that it's a Next.js application needing to be built and deployed to GitHub Pages.

2. **Choosing the Trigger**: Set the workflow to run on pushes to main and pull requests to main.

3. **Setting Up the Environment**: Choose `ubuntu-latest` as the runner and set up Node.js:
   ```yaml
   runs-on: ubuntu-latest
   steps:
     - name: Setup Node.js ⚙️
       uses: actions/setup-node@v4
       with:
         node-version: '22.9'
   ```

4. **Building the Application**: Include steps to install dependencies and build:
   ```yaml
   - name: Install Dependencies 🔧
     run: npm ci
   - name: Build 🏗️
     run: npm run build
   ```

5. **Optimizing the Workflow**: Add caching for npm dependencies.

6. **Configuring for Deployment**: Set the `NEXT_PUBLIC_BASE_PATH` environment variable and configure GitHub Pages:
   ```yaml
   - name: Setup Pages ⚙️
     uses: actions/configure-pages@v4
   ```

7. **Deploying**: Use GitHub's actions to deploy to GitHub Pages:
   ```yaml
   - name: Deploy to GitHub Pages 🚀
     uses: actions/deploy-pages@v4
   ```

8. **Testing and Iterating**: After creating the workflow, test it by pushing changes or creating a pull request, and refine as needed.

This workflow automates the process of building and deploying the Next.js application to GitHub Pages, ensuring that every push or pull request to the main branch triggers a new deployment.
