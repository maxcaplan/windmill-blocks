<?php
/**
 * Windmill blocks icons REST API controller
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Icons;

use Throwable;
use WP_Error;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

use enshrined\svgSanitize\Sanitizer;

if ( ! class_exists( __NAMESPACE__ . '\WM_Blocks_Icons_Rest_Controller' ) ) {

	/**
	 * Windmill blocks icons REST API controller
	 */
	class WM_Blocks_Icons_Rest_Controller extends WP_REST_Controller {
		/**
		 * API namespace
		 *
		 * @var string
		 */
		protected $namespace;

		/**
		 * API endpoint base
		 *
		 * @var string
		 */
		protected $base;

		/**
		 * API version
		 *
		 * @var string
		 */
		protected $version;

		/**
		 * Max file upload size in binary bytes
		 *
		 * @var int
		 */
		protected $max_file_size;

		/**
		 * SVG file sanitizer
		 *
		 * @var Sanitizer;
		 */
		protected $sanitizer;

		/**
		 * Instantiate controller
		 */
		public function __construct() {
			$this->version       = '1';
			$this->namespace     = 'windmill-blocks/v' . $this->version;
			$this->base          = 'icons';
			$this->max_file_size = 5242880;
			$this->sanitizer     = new Sanitizer();
		}

		/**
		 * Setup API
		 */
		public function setup(): void {
			$this->register_routes();
		}

		/**
		 * Register API routes
		 */
		public function register_routes(): void {

			register_rest_route(
				$this->namespace,
				'/' . $this->base,
				array(
					array(
						'methods'             => WP_REST_Server::READABLE,
						'callback'            => array( $this, 'get_items' ),
						'permission_callback' => array( $this, 'get_items_permissions_check' ),
					),

					array(
						'methods'             => WP_REST_Server::CREATABLE,
						'callback'            => array( $this, 'create_item' ),
						'permission_callback' => array( $this, 'create_item_permissions_check' ),
						'args'                => array(),
					),
				)
			);

			register_rest_route(
				$this->namespace,
				'/' . $this->base . '/(?P<name>[\w\-\.]+)',
				array(
					array(
						'methods'             => WP_REST_Server::READABLE,
						'callback'            => array( $this, 'get_item' ),
						'permission_callback' => array( $this, 'get_item_permissions_check' ),
						'args'                => array(),
					),
					array(
						'methods'             => WP_REST_Server::DELETABLE,
						'callback'            => array( $this, 'delete_item' ),
						'permission_callback' => array( $this, 'delete_item_permissions_check' ),
						'args'                => array(),
					),
					array(
						'methods'             => WP_REST_Server::EDITABLE,
						'callback'            => array( $this, 'update_item' ),
						'permission_callback' => array( $this, 'update_item_permissions_check' ),
						'args'                => array(),
					),
				)
			);
		}

		/**
		 * Endpoint Callbacks
		 */

		/**
		 * Get all icon names
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function get_items( $request ): WP_Error|WP_REST_Response {
			$data = array( 'icons' => array() );

			$file_paths = glob( WINDMILL_BLOCKS_UPLOADS_DIR . $this->base . '/*.svg' );

			if ( false !== $file_paths ) {
				foreach ( $file_paths as $file_path ) {
					$data['icons'][] = basename( $file_path, '.svg' );
				}
			}

			return new WP_REST_Response( $data, 200 );
		}

		/**
		 * Get an icon
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function get_item( $request ): WP_Error|WP_REST_Response {
			// Ensure request has a name property.
			if ( ! isset( $request['name'] ) ) {
				return new WP_Error( 'icon_no_name', 'No name sent.', array( 'status' => 400 ) );
			}

			$name = basename( sanitize_file_name( $request['name'] ), '.svg' );

			if ( empty( $name ) ) {
				return new WP_Error( 'icon_invalid_name', 'Invalid icon name.', array( 'status' => 400 ) );
			}

			$file_path = WINDMILL_BLOCKS_UPLOADS_DIR . $this->base . '/' . $name . '.svg';

			$file_content = $this->try_read( $file_path );

			if ( is_wp_error( $file_content ) ) {
				return new WP_Error( 'icon_not_found', 'File not found.', array( 'status' => 404 ) );
			}

			$clean_content = $this->sanitizer->sanitize( $file_content );

			if ( false === $clean_content ) {
				return new WP_Error( 'icon_not_found', 'File not found.', array( 'status' => 404 ) );
			}

			$modified_time = filemtime( $file_path );
			$path_info     = pathinfo( $file_path );

			$data = array(
				'name'     => $path_info['filename'],
				'basename' => $path_info['basename'],
				'content'  => $clean_content,
			);

			if ( false !== $modified_time ) {
				$modified_date = wp_date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $modified_time );

				if ( false !== $modified_date ) {
					$data['modified'] = $modified_date;
				}
			}

			return new WP_REST_Response( $data, 200 );
		}

		/**
		 * Create an icon
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function create_item( $request ): WP_Error|WP_REST_Response {
			// Ensure request has an attached file.
			if ( ! isset( $_FILES ) || empty( $_FILES ) || ! isset( $_FILES ) || empty( $_FILES['file'] ) ) {
				return new WP_Error(
					'icon_no_file',
					'No file sent.',
					array( 'status' => 400 )
				);
			}

			// Prepare file for upload.
			$file       = $_FILES['file'];
			$clean_file = $this->prepare_file( $file );

			// Ensure file was prepared correctly.
			if ( is_wp_error( $clean_file ) ) {
				return $clean_file;
			}

			// Get upload dir.
			$upload_dir = WINDMILL_BLOCKS_UPLOADS_DIR . $this->base;

			// Ensure upload dir exists.
			if ( ! file_exists( $upload_dir ) ) {
				wp_mkdir_p( $upload_dir );
			}

			// Get file upload path.
			$name      = wp_unique_filename( $upload_dir, sanitize_file_name( $file['name'] ) );
			$file_path = $upload_dir . '/' . $name;

			if ( empty( $name ) ) {
				return new WP_Error( 'icon_invalid_name', 'Invalid icon name.', array( 'status' => 400 ) );
			}

			// Upload file.
			$write_error = $this->try_write( $file_path, $clean_file );

			if ( is_wp_error( $write_error ) ) {
				return $write_error;
			}

			// Create response data.
			$modified_time = filemtime( $file_path );
			$path_info     = pathinfo( $file_path );

			$data = array(
				'name'     => $path_info['filename'],
				'basename' => $path_info['basename'],
				'content'  => $clean_file,
			);

			if ( false !== $modified_time ) {
				$modified_date = wp_date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $modified_time );

				if ( false !== $modified_date ) {
					$data['modified'] = $modified_date;
				}
			}

			return new WP_REST_Response( $data, 200 );
		}

		/**
		 * Delete an icon
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function delete_item( $request ): WP_Error|WP_REST_Response {
			// Ensure request has a name property.
			if ( ! isset( $request['name'] ) ) {
				return new WP_Error( 'icon_no_name', 'No name sent.', array( 'status' => 400 ) );
			}

			$name = basename( sanitize_file_name( $request['name'] ), '.svg' );

			if ( empty( $name ) ) {
				return new WP_Error( 'icon_invalid_name', 'Invalid icon name.', array( 'status' => 400 ) );
			}

			$file_path = WINDMILL_BLOCKS_UPLOADS_DIR . $this->base . '/' . $name . '.svg';

			// Ensure file to delete exists.
			if ( ! file_exists( $file_path ) ) {
				return new WP_Error( 'icon_not_found', 'File not found.', array( 'status' => 404 ) );
			}

			// Delete file.
			$delete_error = $this->try_delete( $file_path );

			// Ensure file deletion worked.
			if ( is_wp_error( $delete_error ) ) {
				return $delete_error;
			}

			return new WP_REST_Response( array( 'name' => $name ), 200 );
		}

		/**
		 * Replace icon with new file
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function update_item( $request ): WP_Error|WP_REST_Response {
			// Ensure request has a name property.
			if ( ! isset( $request['name'] ) ) {
				return new WP_Error( 'icon_no_name', 'No name sent.', array( 'status' => 400 ) );
			}

			$name = basename( sanitize_file_name( $request['name'] ), '.svg' );

			if ( empty( $name ) ) {
				return new WP_Error( 'icon_invalid_name', 'Invalid icon name.', array( 'status' => 400 ) );
			}

			// Get path to file.
			$file_path = WINDMILL_BLOCKS_UPLOADS_DIR . $this->base . '/' . $name . '.svg';

			// Ensure file to update exists.
			if ( ! file_exists( $file_path ) ) {
				return new WP_Error( 'icon_not_found', 'File not found.', array( 'status' => 404 ) );
			}

			// Ensure request has an attached file.
			if ( ! isset( $_FILES ) || empty( $_FILES ) || ! isset( $_FILES ) || empty( $_FILES['file'] ) ) {
				return new WP_Error(
					'icon_no_file',
					'No file sent.',
					array( 'status' => 400 )
				);
			}

			// Prepare file for upload.
			$file       = $_FILES['file'];
			$clean_file = $this->prepare_file( $file );

			if ( is_wp_error( $clean_file ) ) {
				return $clean_file;
			}

			// Temporary rename old file.
			$temp_file_path = $this->try_rename(
				$file_path,
				WINDMILL_BLOCKS_UPLOADS_DIR . $this->base . '/old.' . $name . '.svg',
				true
			);

			if ( is_wp_error( $temp_file_path ) ) {
				return $temp_file_path;
			}

			// Write new file.
			$write_status = $this->try_write( $file_path, $clean_file );

			if ( is_wp_error( $write_status ) ) {
				// Restore old file on write failure.
				$this->try_rename( $temp_file_path, $file_path );

				return $write_status;
			}

			// Delete old temp file.
			$delete_status = $this->try_delete( $temp_file_path );

			// Create response data.
			$modified_time = filemtime( $file_path );
			$path_info     = pathinfo( $file_path );

			$data = array(
				'name'     => $path_info['filename'],
				'basename' => $path_info['basename'],
				'content'  => $clean_file,
			);

			if ( false !== $modified_time ) {
				$modified_date = wp_date( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), $modified_time );

				if ( false !== $modified_date ) {
					$data['modified'] = $modified_date;
				}
			}

			return new WP_REST_Response( $data, 200 );
		}

		/**
		 * Endpoint Permissions Callbacks
		 */

		/**
		 * Get all icons request permissions
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function get_items_permissions_check( $request ): WP_Error|bool {
			return true;
		}

		/**
		 * Get icon request permissions
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function get_item_permissions_check( $request ): WP_Error|bool {
			return $this->get_items_permissions_check( $request );
		}

		/**
		 * Create icon request permissions
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function create_item_permissions_check( $request ): WP_Error|bool {
			return current_user_can( 'upload_files' );
		}

		/**
		 * Delete icon request permissions
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function delete_item_permissions_check( $request ): WP_Error|bool {
			return $this->create_item_permissions_check( $request );
		}

		/**
		 * Update icon request permissions
		 *
		 * @param WP_REST_Request $request Request object.
		 */
		public function update_item_permissions_check( $request ): WP_Error|bool {
			return $this->create_item_permissions_check( $request );
		}

		/**
		 * Private Methods
		 */

		/**
		 * Validate and prepare an svg icon file to be saved
		 *
		 * @param array $file File to be processed.
		 */
		private function prepare_file( $file ): WP_Error|string {
			// Ensure file is an svg.
			$ext = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );
			if ( 'svg' !== $ext ) {
				return new WP_Error(
					'icon_invalid_file_type',
					'Only SVG files allowed.',
					array( 'status' => 415 )
				);
			}

			if ( $file['size'] > $this->max_file_size ) {
				return new WP_Error(
					'icon_max_file_size',
					'Max file size of ' . round( $this->max_file_size / 1048576, 2 ) . 'mb exceeded.',
					array( 'status' => 413 )
				);
			}

			// Get file contents.
			$file_content = file_get_contents( $file['tmp_name'] );

			// Sanitize file.
			$clean_file = $this->sanitizer->sanitize( $file_content );

			// Ensure file was properly sanitized.
			if ( ! $clean_file ) {
				return new WP_Error( 'icon_invalid_svg', 'Invalid SVG file.', array( 'status' => 422 ) );
			}

			return $clean_file;
		}

		/**
		 * Attempt to read from a file
		 *
		 * @param string $filename File path to read from.
		 */
		private function try_read( $filename ): WP_Error|string {
			try {
				if ( ! file_exists( $filename ) ) {
					return new WP_Error(
						'icon_read_error',
						'File does not exist.',
						array( 'status' => 500 )
					);
				}

				$contents = file_get_contents( $filename );

				if ( false === $contents ) {
					return new WP_Error(
						'icon_read_error',
						'Failed to read file.',
						array( 'status' => 500 )
					);
				}

				return $contents;
			} catch ( Throwable $error ) {
				return new WP_Error(
					'icon_read_error',
					'Failed to read file.',
					array( 'status' => 500 )
				);
			}
		}

		/**
		 * Attempt to write to a file
		 *
		 * @param string $filename Location to write file to.
		 * @param string $data File data to write.
		 */
		private function try_write( $filename, $data ): WP_Error|int {
			$write_success = file_put_contents( $filename, $data );

			// Ensure file was written to.
			if ( false === $write_success || 0 === $write_success ) {
				return new WP_Error(
					'icon_write_error',
					'Failed to write to file.',
					array( 'status' => 500 )
				);
			}

			return $write_success;
		}

		/**
		 * Attempt to delete a file
		 *
		 * @param string $filename File to delete.
		 */
		private function try_delete( $filename ): WP_Error|bool {
			$delete_status = wp_delete_file( $filename );

			// Ensure file was deleted.
			if ( false === $delete_status ) {
				return new WP_Error(
					'icon_delete_failed',
					'Failed to delete file.',
					array( 'status' => 500 )
				);
			}

			return $delete_status;
		}

		/**
		 * Attempt to rename a file
		 *
		 * @param string $from Current file name.
		 * @param string $to New file name.
		 * @param bool   $ensure_unique Ensure the file is renamed to a unique file name.
		 */
		private function try_rename( $from, $to, $ensure_unique = false ): WP_Error|string {
			$to_filename = $to;

			if ( true === $ensure_unique ) {
				$to_path_info = pathinfo( $to );
				$new_filename = wp_unique_filename( $to_path_info['dirname'], sanitize_file_name( $to_path_info['basename'] ) );

				$to_filename = $to_path_info['dirname'] . '/' . $new_filename;
			}

			$rename_status = rename( $from, $to_filename );

			// Ensure file was renamed.
			if ( false === $rename_status ) {
				return new WP_Error(
					'icon_rename_failed',
					'Failed to rename file.',
					array( 'status' => 500 )
				);
			}

			return $to_filename;
		}
	}
}
