/**
 * @typedef {{
 * tagName?: "button" | "a",
 * ":hover"?: WindmillBlocksButtonHoverAttribute
 * }} WindmillBlocksButtonAttributes
 */

/**
 * @typedef WindmillBlocksButtonTransitionAttribute
 * @property {Number} [duration] Transition duration in milliseconds
 * @property {String} [timing] Transition timing function
 */

/**
 * @typedef WindmillBlocksButtonHoverAttribute
 * @property {Object} [color] Hover color values
 * @property {string} [color.text] Text hover color
 * @property {string} [color.background] Background hover color
 * @property {WindmillBlocksButtonTransitionAttribute} [color.transition] Color hover transition settings
 * @property {WindmillBlocksButtonTransitionAttribute} [transition] Hover transition settings
 */

/**
 * @typedef WindmillBlocksButtonColorProps
 * @property {Object} hoverTextColor
 * @property {String} [hoverTextColor.class]
 * @property {String} [hoverTextColor.color]
 * @property {String} [hoverTextColor.name]
 * @property {String} [hoverTextColor.slug]
 * @property {(value?: String) => void} [setHoverTextColor]
 * @property {Object} hoverBackgroundColor
 * @property {String} [hoverBackgroundColor.class]
 * @property {String} [hoverBackgroundColor.color]
 * @property {String} [hoverBackgroundColor.name]
 * @property {String} [hoverBackgroundColor.slug]
 * @property {(value?: String) => void} [setHoverBackgroundColor]
 */

/**
 * @typedef {import("@wordpress/blocks").BlockEditProps<WindmillBlocksButtonAttributes> & WindmillBlocksButtonColorProps} WindmillBlocksButtonEditProps
 */

/**
 * @typedef {import("@wordpress/blocks").BlockSaveProps<WindmillBlocksButtonAttributes>} WindmillBlocksButtonSaveProps
 */

export {};
