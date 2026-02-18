<?php
/**
 * Plugin REST API
 *
 * @package WindmillBlocks;
 */

namespace WindmillBlocks\Api;

require_once WINDMILL_BLOCKS_PLUGIN_DIR . 'incs/api/icons/index.php';

use WindmillBlocks\Api\Icons\Icons_Rest_Controller;

/**
 * Setup plugin REST API
 */
function setup() {
	// Setup icons api.
	$icons_controller = new Icons_Rest_Controller();
	$icons_controller->setup();
}

add_action( 'rest_api_init', __NAMESPACE__ . '\setup' );
