/**
 * @typedef {{
 * tagName?: "button" | "a",
 * ":hover"?: WindmillBlocksButtonHoverAttribute,
 * transition?: WindmillBlocksButtonTransition
 * }} WindmillBlocksButtonAttributes
 */

/**
 * @typedef WindmillBlocksButtonTransition
 * @property {Number} [duration] Transition duration in milliseconds
 * @property {string} [timing] Transition timing function
 */

/**
 * @typedef WindmillBlocksButtonHoverColor
 * @property {string} [text] Text hover color
 * @property {string} [background] Background hover color
 */

/**
 * @typedef WindmillBlocksButtonHoverAttribute
 * @property {WindmillBlocksButtonHoverColor} [color]
 */

/**
 * @typedef {import("@wordpress/blocks").BlockEditProps<WindmillBlocksButtonAttributes>} WindmillBlocksButtonEditProps
 */

/**
 * @typedef {import("@wordpress/blocks").BlockSaveProps<WindmillBlocksButtonAttributes>} WindmillBlocksButtonSaveProps
 */

export {};
