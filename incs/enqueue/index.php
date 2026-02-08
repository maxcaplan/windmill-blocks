<?php
/**
 * Enqueue plugin scripts and styles
 *
 * @package WindmillBlocks;
 */

namespace WindmillBlocks\Enqueue;

/**
 * Enqueue plugin scripts hook
 */
function enqueue_plugin_scripts() {
	$asset_meta = get_asset_meta( WINDMILL_BLOCKS_PLUGIN_DIR . 'build/js/main.asset.php' );
	if ( is_null( $asset_meta ) ) {
		return;
	}

	wp_enqueue_script(
		'windmill-blocks-script',
		WINDMILL_BLOCKS_PLUGIN_URL . 'build/js/main.js',
		$asset_meta['dependencies'],
		$asset_meta['version'],
		true
	);
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_plugin_scripts' );

/**
 * Enqueue plugin styles hook
 */
function enqueue_plugin_styles() {
	$asset_meta = get_asset_meta( WINDMILL_BLOCKS_PLUGIN_DIR . 'build/css/main.asset.php' );
	if ( is_null( $asset_meta ) ) {
		return;
	}

	wp_enqueue_style(
		'windmill-blocks-style',
		WINDMILL_BLOCKS_PLUGIN_URL . 'build/css/main.css',
		$asset_meta['dependencies'],
		$asset_meta['version']
	);
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_plugin_styles' );

/**
 * Enqueue editor scripts hook
 */
function enqueue_editor_scripts() {
	$asset_meta = get_asset_meta( WINDMILL_BLOCKS_PLUGIN_DIR . 'build/js/editor.asset.php' );
	if ( is_null( $asset_meta ) ) {
		return;
	}

	wp_enqueue_script(
		'windmill-blocks-editor-script',
		WINDMILL_BLOCKS_PLUGIN_URL . 'build/js/editor.js',
		$asset_meta['dependencies'],
		$asset_meta['version'],
		true
	);
}
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_editor_scripts' );

/**
 * Enqueue editor styles hook
 */
function enqueue_editor_content_styles() {
	if ( ! is_admin() ) {
		return;
	}

	$asset_meta = get_asset_meta( WINDMILL_BLOCKS_PLUGIN_DIR . 'build/css/editor.asset.php' );
	if ( is_null( $asset_meta ) ) {
		return;
	}

	wp_enqueue_style(
		'windmill-blocks-editor-content-style',
		WINDMILL_BLOCKS_PLUGIN_URL . 'build/css/editor.css',
		$asset_meta['dependencies'],
		$asset_meta['version']
	);
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_editor_content_styles' );

/**
 * Try to get an asset meta file at a given path
 *
 * @param string $asset_path Path to asset meta file.
 * @return array|null
 */
function get_asset_meta( $asset_path ) {
	if ( ! is_readable( $asset_path ) ) {
		return null;
	}
	return include $asset_path;
}
