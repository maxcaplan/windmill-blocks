<?php
/**
 * Icon singleton class
 *
 * @package WindmillBlocks
 */

namespace WindmillBlocks\Icons;

use DOMElement;

if ( ! class_exists( __NAMESPACE__ . '\WM_Blocks_Icons' ) ) {
	/**
	 * Singelton for managing icons from the windmill blocks icons API
	 */
	class WM_Blocks_Icons {
		/**
		 * Singleton class instance
		 *
		 * @var WM_Blocks_Icons|null
		 */
		protected static $instance = null;

		/**
		 * Allowed tag names in icon SVG content
		 *
		 * @var array<string, string[]>
		 */
		protected $allowed_tags = array(
			'circle'   => array( 'cx', 'cy', 'r', 'pathLength' ),
			'clipPath' => array( 'clipPathUnits' ),
			'defs'     => array(),
			'ellipse'  => array( 'cx', 'cy', 'rx', 'ry', 'pathLength' ),
			'g'        => array(),
			'line'     => array( 'x1', 'x2', 'y1', 'y2', 'pathLength' ),
			'marker'   => array(
				'markerHeight',
				'markerUnits',
				'markerWidth',
				'orient',
				'preserveAspectRatio',
				'refX',
				'refY',
				'viewBox',
			),
			'mask'     => array(
				'height',
				'mask-type',
				'maskContentUnits',
				'maskUnits',
				'x',
				'y',
				'width',
			),
			'path'     => array( 'd', 'pathLength' ),
			'polygon'  => array( 'points', 'pathLength' ),
			'polyline' => array( 'points', 'pathLength' ),
			'rect'     => array( 'x', 'y', 'width', 'height', 'rx', 'ry', 'pathLength' ),
			'svg'      => array( 'xmlns', 'viewBox' ),
		);

		/**
		 * Allowed attributes for icon SVG content nodes.
		 *
		 * @var string[]
		 */
		protected $allowed_attributes = array(
			'clip-path',
			'clip-rule',
			'fill-rule',
			'marker-start',
			'marker-mid',
			'marker-end',
			'mask',
			'transform',
			'transform-box',
			'transform-origin',
			'visibility',
		);

		/**
		 * Icon data array.
		 *
		 * @var array<string, array<string, string>>
		 */
		protected $icons = array();

		/**
		 * Singelton class can not be directly instantiated
		 */
		protected function __construct() {}

		/**
		 * Singelton class can not be cloned
		 */
		protected function __clone(): void {}

		/**
		 * Singelton class can not be restored from string
		 *
		 * @throws \Exception Cannot unserialize a singleton.
		 */
		public function __wakeup(): void {
			throw new \Exception( 'Cannot unserialize a singleton.' );
		}

		/**
		 * Get singleton instance.
		 */
		public static function get_instance(): WM_Blocks_Icons {
			if ( empty( self::$instance ) ) {
				error_log( 'New instance of WM_Blocks_Icons created' );
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Get allowed attributes for a given tag name in an icons SVG content
		 *
		 * @param string $tag_name Name of the tag to get attributes for.
		 *
		 * @return string[] Merged array of tags allowed attributes and globally allowed attributes.
		 */
		public function get_allowed_tag_attributes( string $tag_name ) {
			return array_merge( $this->allowed_tags[ $tag_name ] ?? array(), $this->allowed_attributes );
		}

		/**
		 * Get SVG content string for a given icon
		 *
		 * @param string                $name Name of the icon to get content for.
		 * @param array<string, string> $attributes Array of attributes to add to the icon content
		 */
		public function get_icon( string $name, array $attributes = array() ): string|false {

			$name = basename( $name, '.svg' );

			$icon = $this->icons[ $name ] ?? null;

			if ( empty( $icon ) ) {
				$filename = WINDMILL_BLOCKS_UPLOADS_DIR . 'icons/' . basename( $name, '.svg' ) . '.svg';

				// Don't render block if icon file is unreadable.
				if ( ! is_readable( $filename ) ) {
					return false;
				}

				$file_contents = file_get_contents( $filename );

				if ( empty( $file_contents ) ) {
					return false;
				}

				$sanitized_content = $this->sanitize_icon_content( $file_contents );

				if ( empty( $sanitized_content ) ) {
					return false;
				}

				$this->icons[ $name ] = array( 'content' => $sanitized_content );

				$icon = $this->icons[ $name ];
			}

			return $this->set_icon_content_attributes( $icon['content'], $attributes );
		}

		/**
		 * Sanitize an icon SVG content string
		 *
		 * @param string $content The content to sanitize.
		 */
		public function sanitize_icon_content( string $content ): string|false {
			// Disable standard libxml errors.
			$previous_use_errors = libxml_use_internal_errors( true );

			try {
				$svg_doc                     = new \DOMDocument();
				$svg_doc->preserveWhiteSpace = false;
				$svg_doc->resolveExternals   = false;
				$svg_doc->substituteEntities = false;

				if ( ! $svg_doc->loadXML( $content, LIBXML_NONET ) ) {
					return false;
				}

				// Reject documents with a doctype set.
				if ( ! empty( $svg_doc->doctype ) ) {
					return false;
				}

				$root_element = $svg_doc->documentElement;

				// Require an SVG root element.
				if ( empty( $root_element ) || 'svg' !== $root_element->tagName ) {
					return false;
				}

				// Set svg xmlns attribute.
				$root_element->setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );

				// Ensure svg has a viewBox attribute set.
				if ( ! $root_element->hasAttribute( 'viewBox' ) ) {
					$root_element->setAttribute( 'viewBox', '0 0 24 24' );
				}

				// Sanitize svg elements.
				$this->sanitize_icon_element( $root_element );

				return $svg_doc->saveXML( null, LIBXML_NOXMLDECL );
			} finally {
				// Reset libxml errors.
				libxml_clear_errors();
				libxml_use_internal_errors( $previous_use_errors );
			}
		}

		/**
		 * Sanitize an element in an icon SVG document
		 *
		 * @param DOMElement $element The element to sanitize.
		 */
		private function sanitize_icon_element( DOMElement $element ): void {
			// Remove unallowed elements.
			if ( ! array_key_exists( $element->tagName, $this->allowed_tags ) ) {
				$element->parentNode?->removeChild( $element );
				return;
			}

			// Get fill and stroke attributes for elemenet.
			$fill_and_stroke_attributes = $this->get_normalized_fill_and_stroke( $element );

			// Get all allowed attributes for this tag.
			$allowed_tag_attributes = $this->get_allowed_tag_attributes( $element->tagName );

			// Remove all unallowed attributes.
			foreach ( iterator_to_array( $element->attributes ) as $attribute ) {
				if (
				! in_array( $attribute->nodeName, $allowed_tag_attributes, true )
				) {
					$element->removeAttributeNode( $attribute );
				}
			}

			// Set fill and stroke attributes.
			foreach ( $fill_and_stroke_attributes as $attribute_name => $attribute_value ) {
				if ( ! empty( $attribute_value ) ) {
					$element->setAttribute( $attribute_name, $attribute_value );
				}
			}

			// Sanitize child elements.
			foreach ( iterator_to_array( $element->childNodes ) as $child ) {
				if ( $child instanceof \DOMElement ) {
					$this->sanitize_icon_element( $child );
				} else {
					// Remove non element children.
					$element->removeChild( $child );
				}
			}
		}

		/**
		 * Get normalized fill and stroke attributes for an icon SVG DOM element
		 *
		 * @param DOMElement $element The element to get the attributes for.
		 *
		 * @return array<string, string>
		 */
		private function get_normalized_fill_and_stroke( DOMElement $element ): array {
			// Get element inline styles.
			$style_value = $element->getAttribute( 'style' );

			$inline_styles = array();

			// Parse array of inline styles.
			if ( ! empty( $style_value ) ) {
				preg_match_all( '/([\w-]+)\s*:\s*([^;]+)\s*;?/', $style_value, $matches, PREG_SET_ORDER );
				foreach ( $matches as $match ) {
					$inline_styles[ trim( $match[1] ) ] = trim( $match[2] );
				}
			}

			$color_value = function ( string|null $value ) {
				$value = trim( strval( $value ) );

				if ( empty( $value ) ) {
					return null;
				}

				if ( 'none' === $value ) {
					return $value;
				}

				return 'currentColor';
			};

			$style_or_attribute = function ( string $key ) use ( $inline_styles, $element ) {
				return $inline_styles[ $key ] ?? $element->getAttribute( $key );
			};

			return array(
				'fill'              => $color_value( $style_or_attribute( 'fill' ) ),
				'stroke'            => $color_value( $style_or_attribute( 'stroke' ) ),
				'stroke-dasharray'  => $style_or_attribute( 'stroke-dasharray' ),
				'stroke-dashoffset' => $style_or_attribute( 'stroke-dashoffset' ),
				'stroke-linecap'    => $style_or_attribute( 'stroke-linecap' ),
				'stroke-linejoin'   => $style_or_attribute( 'stroke-linejoin' ),
				'stroke-miterlimit' => $style_or_attribute( 'stroke-miterlimit' ),
				'stroke-width'      => $style_or_attribute( 'stroke-width' ),
			);
		}

		/**
		 * Set attributes for an icons SVG content string
		 *
		 * @param string                     $content The icon SVG content.
		 * @param array<string, string|null> $attributes The attributes to set.
		 */
		private function set_icon_content_attributes( string $content, array $attributes ): string|false {
			// Remove null attributes.
			$attributes = array_filter(
				$attributes,
				function ( $item ) {
					return isset( $item );
				}
			);

			// Return unmodified content if there are no attributes to set.
			if ( count( $attributes ) <= 0 ) {
				return $content;
			}

			// Disable standard libxml errors.
			$previous_use_errors = libxml_use_internal_errors( true );

			try {
				$svg_doc                     = new \DOMDocument();
				$svg_doc->preserveWhiteSpace = false;
				$svg_doc->resolveExternals   = false;
				$svg_doc->substituteEntities = false;

				if ( ! $svg_doc->loadXML( $content, LIBXML_NONET ) ) {
					return false;
				}

				$root_element = $svg_doc->documentElement;

				// Require an SVG root element.
				if ( empty( $root_element ) || 'svg' !== $root_element->tagName ) {
					return false;
				}

				// Set attributes
				foreach ( $attributes as $attribute_name => $attribute_value ) {
					$root_element->setAttribute( $attribute_name, $attribute_value );
				}

				return $svg_doc->saveXML( null, LIBXML_NOXMLDECL );
			} finally {
				// Reset libxml errors.
				libxml_clear_errors();
				libxml_use_internal_errors( $previous_use_errors );
			}
		}
	}
}
