<?php
/**
 * Windmill Blocks
 *
 * @package           WindmillBlocks
 * @author            Max Caplan
 * @copyright         2026 Max Caplan
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       Windmill Blocks
 * Description:       Extensible WordPress theme blocks for developers and designers.
 * Version:           0.1.0
 * Requires at least: 6.9
 * Requires PHP:      8.3
 * Author:            Max Caplan
 * Author URI:        https://maxcaplan.com
 * Text Domain:       windmill-blocks
 * License:           GPL-3.0
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 */

namespace WindmillBlocks;

/**
 * Prevent direct file access for plugin
 * https://developer.wordpress.org/plugins/plugin-basics/best-practices/#avoiding-direct-file-access
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define plugin global constants.
 */
define( 'WINDMILL_BLOCKS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WINDMILL_BLOCKS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'WINDMILL_BLOCKS_PLUGIN_FILE', __FILE__ );
define( 'WINDMILL_BLOCKS_PLUGIN_BASE', plugin_basename( __FILE__ ) );

/**
 * Require plugin includes.
 */
require_once WINDMILL_BLOCKS_PLUGIN_DIR . 'incs/register_blocks.php';
