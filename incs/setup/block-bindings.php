<?php
/**
 * Plugin block bindings setup
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Setup\BlockBindings;

/**
 * Icon block attribute bindings support filter
 *
 * @param string[] $supported_attributes Supported block binding attributes.
 */
function icon_block_block_binding_attributes( $supported_attributes ) {
	$supported_attributes[] = 'icon';
	$supported_attributes[] = 'ariaLabel';
	$supported_attributes[] = 'flipHorizontal';
	$supported_attributes[] = 'flipVertical';
	$supported_attributes[] = 'rotation';
	$supported_attributes[] = 'strokeWidth';
	$supported_attributes[] = 'nonScalingStroke';

	return $supported_attributes;
}

add_filter(
	'block_bindings_supported_attributes_windmill-blocks/icon',
	__NAMESPACE__ . '\icon_block_block_binding_attributes'
);
