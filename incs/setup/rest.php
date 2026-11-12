<?php
/**
 * Plugin REST API controllers setup
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Setup\Rest;

require_once WINDMILL_BLOCKS_PLUGIN_DIR . 'incs/class-wm-blocks-icons-rest-controller.php';

use WindmillBlocks\Icons\WM_Blocks_Icons_Rest_Controller;

/**
 * Initialize REST APIS
 */
function rest_init(): void {
	$icons_api = new WM_Blocks_Icons_Rest_Controller();
	$icons_api->setup();
}

add_action( 'rest_api_init', __NAMESPACE__ . '\rest_init' );
