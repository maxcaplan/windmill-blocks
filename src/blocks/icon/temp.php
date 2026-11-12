<?php

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * Sanitize an SVG string using element and attribute whitelists.
 *
 * @param string                  $svg SVG source.
 * @param array<string, string[]> $allowed_tags
 *        Map of element names to their allowed attributes.
 *
 * @return string|false Sanitized SVG or false if invalid.
 */
function sanitize_svg( string $svg, array $allowed_tags ): string|false {
	$previous_errors = libxml_use_internal_errors( true );

	try {
		$document                     = new DOMDocument( '1.0', 'UTF-8' );
		$document->resolveExternals   = false;
		$document->substituteEntities = false;

		if ( ! $document->loadXML( $svg, LIBXML_NONET ) ) {
			return false;
		}

		// Reject documents containing a DTD.
		if ( $document->doctype !== null ) {
			return false;
		}

		$root = $document->documentElement;

		// Require an SVG root element.
		if (
			! $root ||
			$root->localName !== 'svg' ||
			! in_array( $root->namespaceURI, array( '', SVG_NAMESPACE ), true )
		) {
			return false;
		}

		// Ensure the document has the correct SVG namespace.
		if ( ! $root->hasAttribute( 'xmlns' ) ) {
			$root->setAttribute( 'xmlns', SVG_NAMESPACE );
		} elseif ( $root->getAttribute( 'xmlns' ) !== SVG_NAMESPACE ) {
			return false;
		}

		sanitize_svg_node( $root, $allowed_tags, true );

		return $document->saveXML( $root ) ?: false;
	} finally {
		libxml_clear_errors();
		libxml_use_internal_errors( $previous_errors );
	}
}

/**
 * Recursively sanitize an SVG node.
 *
 * @param DOMElement              $element
 * @param array<string, string[]> $allowed_tags
 * @param bool                    $is_root
 */
function sanitize_svg_node(
	DOMElement $element,
	array $allowed_tags,
	bool $is_root = false
): void {
	$tag = $element->localName;

	// Remove elements not present in the whitelist.
	if ( ! array_key_exists( $tag, $allowed_tags ) ) {
		$element->parentNode?->removeChild( $element );
		return;
	}

	// Remove attributes that aren't explicitly allowed.
	$allowed_attributes = $allowed_tags[ $tag ];

	foreach ( iterator_to_array( $element->attributes ) as $attribute ) {
		$name = $attribute->nodeName;

		// Preserve the SVG namespace declaration on the root.
		if (
			$is_root &&
			$name === 'xmlns' &&
			$attribute->nodeValue === SVG_NAMESPACE
		) {
			continue;
		}

		if (
			$attribute->namespaceURI !== null ||
			! in_array( $name, $allowed_attributes, true )
		) {
			$element->removeAttributeNode( $attribute );
		}
	}

	// Recursively process child elements.
	foreach ( iterator_to_array( $element->childNodes ) as $child ) {
		if ( $child instanceof DOMElement ) {
			sanitize_svg_node( $child, $allowed_tags );
		} elseif (
			! ( $child instanceof DOMText ) &&
			! ( $child instanceof DOMCdataSection )
		) {
			// Remove comments, processing instructions, etc.
			$element->removeChild( $child );
		}
	}
}
