<?php
/**
 * Initialize plugin
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Setup;

require_once WINDMILL_BLOCKS_PLUGIN_DIR . 'incs/setup/global-styles.php';

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register custom block categories
 *
 * @param array  $block_categories Block categories array.
 * @param object $editor_context Editor context object.
 */
function register_block_categories( $block_categories, $editor_context ) {
	if ( ! empty( $editor_context->post ) ) {
		array_push(
			$block_categories,
			array(
				'slug'  => 'windmill-blocks',
				'title' => __( 'Windmill Blocks', 'windmill-blocks' ),
				'icon'  => 'plugins',
			)
		);
	}

	return $block_categories;
}
add_filter( 'block_categories_all', __NAMESPACE__ . '\register_block_categories', 10, 2 );

/**
 * Register blocks from `blocks-manifest.php` and registers the block types
 */
function register_dynamic_blocks() {
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection(
			WINDMILL_BLOCKS_PLUGIN_DIR . 'build/blocks',
			WINDMILL_BLOCKS_PLUGIN_DIR . 'build/blocks-manifest.php'
		);
	} else {
		if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
			wp_register_block_metadata_collection(
				WINDMILL_BLOCKS_PLUGIN_DIR . 'build/blocks',
				WINDMILL_BLOCKS_PLUGIN_DIR . 'build/blocks-manifest.php'
			);
		}
		$manifest_data = require WINDMILL_BLOCKS_PLUGIN_DIR . 'build/blocks-manifest.php';
		foreach ( array_keys( $manifest_data ) as $block_type ) {
			register_block_type( WINDMILL_BLOCKS_PLUGIN_DIR . "build/blocks/{$block_type}" );
		}
	}
}
add_action( 'init', __NAMESPACE__ . '\register_dynamic_blocks' );

/**
 * Register nonce value for API validation
 */
function register_nonce() {
	wp_localize_script(
		'wp-api',
		'wpApiSettings',
		array(
			'nonce' => wp_create_nonce( 'wp_rest' ),
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_nonce' );

/**
 * Add generated block styles to page head
 */
function inline_generated_block_styles() {
	global $windmill_blocks_block_styles;

	if ( ! is_array( $windmill_blocks_block_styles ) ) {
		return;
	}

	if ( count( $windmill_blocks_block_styles ) <= 0 ) {
		return;
	}

	echo '<style id="windmill-blocks-inline-block-styles">' . "\r\n" . implode( "\r\n", $windmill_blocks_block_styles ) . "\r\n" . '</style>';
}
add_action( 'wp_head', __NAMESPACE__ . '\inline_generated_block_styles' );
