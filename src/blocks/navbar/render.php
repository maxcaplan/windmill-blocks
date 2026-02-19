<?php
/**
 * Navbar block frontend rendering
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Blocks\Navbar;

$windmill_blocks_navbar_generate_block_styles = static function ( $attributes ) {
	$desktop_breakpoint = $attributes['desktopBreakpoint'] ?? null;

	if ( ! isset( $desktop_breakpoint ) || ! is_string( $desktop_breakpoint ) ) {
		$preset_value = wp_get_global_settings( array( 'layout', 'contentSize' ) );

		if ( ! isset( $preset_value ) || ! is_string( $preset_value ) ) {
			$desktop_breakpoint = '600px';
		} else {
			$desktop_breakpoint = $preset_value;
		}
	}

	global $windmill_blocks_block_styles;

	if ( ! isset( $windmill_blocks_block_styles ) ) {
		$windmill_blocks_block_styles = array();
	}

	$windmill_blocks_block_styles[] = sprintf(
		'@media only screen and (max-width: %s) {
	.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-desktop {
		display: none !important;
	}

	.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-mobile,
	.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-mobile-menu {
		display: flex !important;
	}
}

.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-desktop {
	display: flex;
}

.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-mobile,
.wp-block-windmill-blocks-navbar .wp-block-windmill-blocks-navbar-mobile-menu {
	display: none;
}',
		$desktop_breakpoint
	);
};


$windmill_blocks_navbar_generate_block_styles( $attributes );

ob_start();
?>

<nav <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo $content; ?>
</nav>


<?php
$output = ob_get_contents();
ob_end_clean();

echo $output;
