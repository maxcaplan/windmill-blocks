<?php
/**
 * Icon block front end rendering
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Blocks\Icon;

use function WindmillBlocks\Util\Theme\get_preset;

$windmill_blocks_icon_default_icon = static function () {
	return '<svg
		viewBox="0 0 20 20"
		width="24"
		height="24"
		class="windmill-blocks-icon__inner-icon"
	>
		<rect x="0" fill="none" width="20" height="20"/>
		<g>
			<path d="M10 1l3 6 6 .75-4.12 4.62L16 19l-6-3-6 3 1.13-6.63L1 7.75 7 7z" fill="currentColor"/>
		</g>
	</svg>';
};

$windmill_blocks_icon_get_extra_attributes = static function ( $attributes ) {
	$out = array(
		'class' => '',
		'style' => '',
	);

	/**
	 * Size attributes
	 */
	if ( isset( $attributes['size'] ) && is_string( $attributes['size'] ) ) {
		$size_value = get_preset(
			$attributes['size'] ?? null,
			array( 'spacing', 'spacingSizes' ),
			true
		)['size'] ??
		$attributes['size'];

		$out['style'] = $out['style'] . 'width:' . $size_value . ';height:' . $size_value . ';';
	}

	if ( isset( $attributes['ariaLabel'] ) && is_string( $attributes['ariaLabel'] ) ) {
		$out['aria-label'] = $attributes['ariaLabel'];
	}

	if ( $out ) {
		return $out;
	}
};

$windmill_blocks_icon_get_icon_contents = static function ( $attributes, $default ) {
	if ( ! isset( $attributes['icon'] ) || ! is_string( $attributes['icon'] ) ) {
		return $default;
	}

	$filename = WINDMILL_BLOCKS_UPLOADS_DIR . 'icons/' . $attributes['icon'] . '.svg';

	if ( ! is_readable( $filename ) ) {
		return $default;
	}

	try {
		$svg_dom = new \DOMDocument();
		$svg_dom->loadXML( file_get_contents( $filename ) );

		$root_element = $svg_dom->documentElement;

		if ( is_null( $root_element ) || $root_element->tagName !== 'svg' ) {
			return $default;
		}

		$root_element->removeAttribute( 'id' );
		$root_element->setAttribute( 'width', '24' );
		$root_element->setAttribute( 'height', '24' );
		$root_element->setAttribute( 'class', 'windmill-blocks-icon__inner-icon' );
		$root_element->setAttribute( 'fill', 'currentColor' );

		return $svg_dom->saveHTML();
	} catch ( \Throwable $th ) {
		return $default;
	}
};

?>


<span
<?php
echo wp_kses_data(
	get_block_wrapper_attributes(
		$windmill_blocks_icon_get_extra_attributes( $attributes )
	)
);
?>
>
	<?php
	echo $windmill_blocks_icon_get_icon_contents(
		$attributes,
		$windmill_blocks_icon_default_icon()
	);
	?>
</span>
