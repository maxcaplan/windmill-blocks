# Windmill Blocks
A Wordpress plugin providing powerful blocks for the full site editor

> [!WARNING]
> This repository is in active beta development. Large and breaking changes may be made.

## What is This Project?
Windmill Blocks is a collection of blocks for the Wordpress full site editor.

The blocks are designed to enhance and extend the abilities of Wordpress block themes.

## What is the Windmill Project
The Windmill project is a suite of tools designed to streamline and enhance the process of authoring Wordpress themes with the [full site editor](https://wordpress.org/documentation/article/site-editor/).

The project currently includes: [Windmill Theme](https://github.com/maxcaplan/windmill-theme), [Windmill Blocks](https://github.com/maxcaplan/windmill-blocks), and [Windmill Data](https://github.com/maxcaplan/windmill-data)

## Features
- Integrated with the Wordpress theme API
- Fully configurable from the site editor
- Javascript and PostCSS build system
- IDE tooling configuration for Wordpress coding standards

## Blocks
- **Button/Button group:**
  
  An advanced interactable button with full support for inner block content.
  Support for hover styles: colors, border radius, and opacity

- **Icon/Icon group:**
  
  Custom SVG icons.
  Support for uploading and managing an icon library in the editor.
  Renders icons as inline SVGs for high performance and styling capabilities.

- **Navbar:**
  
  Responsive navbar allowing different layouts for desktop and mobile devices.
  Supports custom breakpoint values.

- **Navbar Mobile Menu:**
  
  Collapsible menu for mobile navigation.

## Requirements
### Installation
- Wordpress: ^6.9
- PHP: ^8.3

### Development
- composer: ^2.9.2
- node: ^24.11.1
- pnpm: ^10.28.2

## Installation
Windmill Blocks does not currently provide a prepackaged release.

## Setup
Clone the repository into the `wp-contet/plugins/` directory of a Wordpress installation

```bash
git clone https://github.com/maxcaplan/windmill-blocks.git
```

In the `windmill-blocks` directory, install `pnpm` and `composer` dependencies

```bash
cd windmill-blocks
pnpm install
composer install
```

Build the plugin

```bash
pnpm run build
```

Windmill Blocks can now be activated from the Wordpress admin panels **plugins** menu
