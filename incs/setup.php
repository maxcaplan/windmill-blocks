<?php
/**
 * Initialize plugin
 *
 * @package WindmillBlocks;
 */

namespace WindmillBlocks;

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
 * Register plugin blocks
 */
function register_blocks() {
	// Get all block.json files.
	$all_blocks_meta = glob( WINDMILL_BLOCKS_PLUGIN_DIR . 'build/blocks/*/block.json' );

	if ( false === $all_blocks_meta ) {
		return;
	}

	// Register blocks with metadata.
	foreach ( $all_blocks_meta as $block_meta ) {
		register_block_type( $block_meta );
	}
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );

/**
 * Register server-side code for individual blocks.
 */
function register_dynamic_blocks() {
	foreach ( glob( dirname( __DIR__ ) . '/src/blocks/*/index.php' ) as $dynamic_block_meta ) {
		require_once $dynamic_block_meta;
	}
}
register_dynamic_blocks();
