# Fun Projects

This folder is a tucked-away local playground. Open `index.html` directly in a browser to browse the tiles.

## Add A New Project

1. Create a new folder inside `fun`, for example `fun/my-project/`.
2. Add an `index.html` file inside that folder.
3. Add the project to `fun/projects.js`:

```js
{
  title: "My Project",
  slug: "my-project",
  url: "../my-project/index.html",
  mark: "M",
  description: "A short line for the tile."
}
```

The `slug` should match the folder name in `fun/`. The `url` should point to the top-level wrapper.

## Add A Top-Level URL

Fun projects can live in this folder while still being reachable from the site root, such as `/assassin/`.

1. Create a top-level folder, for example `assassin/`.
2. Add an `index.html` wrapper in that folder that points to `../fun/my-project/index.html`.
3. Add `url: "../my-project/index.html"` to the project entry in `fun/projects.js`.
