<?php
/**
 * Icon block front end rendering
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Blocks\Icon;

require_once WINDMILL_BLOCKS_PLUGIN_DIR . 'incs/class-wm-blocks-icons.php';

use WindmillBlocks\Icons\WM_Blocks_Icons;

if ( ! function_exists( __NAMESPACE__ . '\render_block' ) ) {
	/**
	 * Render the blocks html
	 *
	 * @param array    $attributes Block attributes.
	 * @param string   $content Block content.
	 * @param WP_Block $block Block instance.
	 */
	function render_block( $attributes, $content, $block ) {
		$icon = $attributes['icon'] ?? null;

		// Don't render block if icon is not set.
		if ( empty( $icon ) ) {
			return;
		}

		// Text and background color styles.
		$color_styles = array();

		$preset_text_color    = array_key_exists( 'textColor', $attributes ) ? "var:preset|color|{$attributes['textColor']}" : null;
		$custom_text_color    = $attributes['style']['color']['text'] ?? null;
		$color_styles['text'] = $preset_text_color ? $preset_text_color : $custom_text_color;

		$preset_background_color    = array_key_exists( 'backgroundColor', $attributes ) ? "var:preset|color|{$attributes['backgroundColor']}" : null;
		$custom_background_color    = $attributes['style']['color']['background'] ?? null;
		$color_styles['background'] = $preset_background_color ? $preset_background_color : $custom_background_color;

		// Border styles.
		$border_styles = array();

		$preset_color           = array_key_exists( 'borderColor', $attributes ) ? "var:preset|color|{$attributes['borderColor']}" : null;
		$custom_color           = $attributes['style']['border']['color'] ?? null;
		$border_styles['color'] = $preset_color ? $preset_color : $custom_color;

		if ( isset( $attributes['style']['border']['radius'] ) ) {
			$border_styles['radius'] = $attributes['style']['border']['radius'];
		}
		if ( isset( $attributes['style']['border']['style'] ) ) {
			$border_styles['style'] = $attributes['style']['border']['style'];
		}
		if ( isset( $attributes['style']['border']['width'] ) ) {
			$border_styles['width'] = $attributes['style']['border']['width'];
		}

		foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
			$border                 = $attributes['style']['border'][ $side ] ?? null;
			$border_styles[ $side ] = array(
				'color' => $border['color'] ?? null,
				'style' => $border['style'] ?? null,
				'width' => $border['width'] ?? null,
			);
		}

		// Padding styles.
		$spacing_styles = array();
		if ( isset( $attributes['style']['spacing']['padding'] ) ) {
			$spacing_styles['padding'] = $attributes['style']['spacing']['padding'];
		}

		// Dimension styles.
		$dimensions_styles = array();
		if ( isset( $attributes['style']['dimensions']['width'] ) ) {
			$dimensions_styles['width'] = $attributes['style']['dimensions']['width'];
		}

		// Generate styles and classes.
		$styles = wp_style_engine_get_styles(
			array(
				'color'      => $color_styles,
				'border'     => $border_styles,
				'spacing'    => $spacing_styles,
				'dimensions' => $dimensions_styles,
			)
		);

		if ( $attributes['flipVertical'] ?? false ) {
			$styles['classnames'] = ( $styles['classnames'] ?? '' ) . ' is-flip-vertical';
		}

		if ( $attributes['flipHorizontal'] ?? false ) {
			$styles['classnames'] = ( $styles['classnames'] ?? '' ) . ' is-flip-horizontal';
		}

		if ( $attributes['nonScalingStroke'] ?? false ) {
			$styles['classnames'] = ( $styles['classnames'] ?? '' ) . ' is-non-scaling-stroke';
		}

		if ( ! empty( $attributes['strokeWidth'] ?? null ) ) {
			$styles['classnames'] = ( $styles['classnames'] ?? '' ) . ' has-stroke-width';
		}

		if ( ( $attributes['rotation'] ?? 0 ) > 0 ) {
			$styles['css'] = ( $styles['css'] ?? '' ) . 'rotate:' . strval( $attributes['rotation'] ) . 'deg;';
		}

		$icon_content = WM_Blocks_Icons::get_instance()->get_icon(
			$icon,
			array(
				'classnames' => $styles['classnames'] ?? null,
				'style'      => $styles['css'] ?? null,
				'aria-label' => $attributes['ariaLabel'] ?? '',
			)
		);

		printf( '<span %s>%s</span>', get_block_wrapper_attributes(), $icon_content );
	}
}

render_block( $attributes, $content, $block );
