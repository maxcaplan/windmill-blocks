/**
 * @typedef {{
 * tagName?: "button" | "a",
 * opacity?: number,
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
 * @typedef WindmillBlocksButtonHoverBorderRadius
 * @property {string} [topLeft]
 * @property {string} [topRight]
 * @property {string} [bottomLeft]
 * @property {string} [bottomRight]
 */

/**
 * @typedef WindmillBlocksButtonHoverAttribute
 * @property {WindmillBlocksButtonHoverColor} [color]
 * @property {WindmillBlocksButtonHoverBorderRadius} [borderRadius]
 * @property {number} [opacity]
 */

/**
 * @typedef {import("@wordpress/blocks").BlockEditProps<WindmillBlocksButtonAttributes>} WindmillBlocksButtonEditProps
 */

/**
 * @typedef {import("@wordpress/blocks").BlockSaveProps<WindmillBlocksButtonAttributes>} WindmillBlocksButtonSaveProps
 */

export {};
