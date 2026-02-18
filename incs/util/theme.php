<?php
/**
 * Theme utility functions
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Util\Theme;

/**
 * Determine if a given value is a valid preset string
 *
 * @param mixed $value - Value to test.
 */
function is_preset_string( $value ) {
	return (
		is_string( $value ) &&
		str_starts_with( $value, 'var:preset|' ) &&
		count( explode( '|', $value ) ) === 3
	);
}

/**
 * Get the parts of a preset string.
 *
 * @param string $preset - Preset string to parse.
 */
function preset_string_parts( $preset ): false|array {
	if ( ! is_preset_string( $preset ) ) {
		return false;
	}

	$preset_parts = explode( '|', $preset );

	return array(
		'base'     => $preset_parts[0],
		'category' => $preset_parts[1],
		'slug'     => $preset_parts[2],
	);
}

/**
 * Get a preset object for a given preset string
 *
 * @param mixed $preset - Preset to get value for.
 * @param array $settings_path - Path to settings to retrieve value from.
 * @param bool  $flatten_settings - Flatten sub arrays for settings.
 */
function get_preset( $preset, $settings_path, $flatten_settings ): mixed {
	$preset_parts = preset_string_parts( $preset );

	if ( false === $preset_parts ) {
		return $preset;
	}

	$preset_values = wp_get_global_settings( $settings_path );

	if ( empty( $preset_values ) ) {
		return $preset;
	}

	if ( $flatten_settings ) {
		$preset_values = array_merge( array(), ...array_values( $preset_values ) );
	}

	foreach ( $preset_values as $preset_item ) {
		if ( isset( $preset_item['slug'] ) && $preset_item['slug'] === $preset_parts['slug'] ) {
			return $preset_item;
		}
	}

	return $preset;
}
