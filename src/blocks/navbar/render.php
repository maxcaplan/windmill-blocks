<?php
/**
 * Navbar block frontend rendering
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Blocks\Navbar;

global $windmill_blocks_block_styles;

/**
 * Get a string value for the blocks desktop breakpoint
 *
 * @param array $attributes Array of block attributes.
 *
 * @return string
 */
function windmill_blocks_get_desktop_breakpoint( $attributes ): string {
	$desktop_breakpoint = $attributes['desktopBreakpoint'] ?? null;

	if ( ! isset( $desktop_breakpoint ) || ! is_string( $desktop_breakpoint ) ) {
		$preset_value = wp_get_global_settings( array( 'layout', 'contentSize' ) );

		if ( ! isset( $preset_value ) || ! is_string( $preset_value ) ) {
			$desktop_breakpoint = '600px';
		} else {
			$desktop_breakpoint = $preset_value;
		}
	}

	return $desktop_breakpoint;
}

$windmill_blocks_navbar_id                 = uniqid( 'windmill-blocks-navbar-' );
$windmill_blocks_navbar_desktop_breakpoint = windmill_blocks_get_desktop_breakpoint( $attributes );

// Create global block styles array if not set.
if ( ! isset( $windmill_blocks_block_styles ) ) {
	$windmill_blocks_block_styles = array();
}

// Add navbar styles to global block styles.
$windmill_blocks_block_styles[] = sprintf(
	'@media only screen and (max-width: %s) {
.%s .wp-block-windmill-blocks-navbar-desktop {
	display: none !important;
}

.%s .wp-block-windmill-blocks-navbar-mobile,
.%s .wp-block-windmill-blocks-navbar-mobile-menu {
	display: flex !important;
}
}',
	$windmill_blocks_navbar_desktop_breakpoint,
	$windmill_blocks_navbar_id,
	$windmill_blocks_navbar_id,
	$windmill_blocks_navbar_id
);

ob_start();
?>

<nav
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => $windmill_blocks_navbar_id,
				'style' => '--wm--block--breakpoint--desktop: ' . $windmill_blocks_navbar_desktop_breakpoint,
			)
		)
	);
	?>
	data-desktop-breakpoint="<?php echo $windmill_blocks_navbar_desktop_breakpoint; ?>"
>
	<?php echo $content; ?>
</nav>


<?php
$output = ob_get_contents();
ob_end_clean();

echo $output;
