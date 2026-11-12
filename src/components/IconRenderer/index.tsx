import { useMemo, cloneElement, SVGAttributes } from 'react';
import parse, {
	DOMNode,
	Element,
	domToReact,
	HTMLReactParserOptions,
} from 'html-react-parser';

import { safeHTML } from '@wordpress/dom';

import {
	getAllowedIconChildAttributes,
	isAllowedIconChild,
	normalizedFillAndStroke,
} from './utils';

import { IconRendererComponent } from './types';

/** Render a given SVG content string as an inline icon component */
export const IconRenderer: IconRendererComponent = ({
	content,
	onError,
	onSuccess,
	...wrapper_props
}) => {
	/** Parser options for icon child elements */
	const child_parser_options: HTMLReactParserOptions = {
		replace: (domNode) => {
			// Only parse element nodes
			if (domNode.type !== 'tag' || !isAllowedIconChild(domNode)) {
				return <></>;
			}

			const TagName = domNode.name;
			const attributes = getAllowedIconChildAttributes({
				name: domNode.name,
				attributes: domNode.attribs,
			});

			return (
				<TagName
					{...attributes}
					{...normalizedFillAndStroke({
						attributes: domNode.attribs,
					})}
				>
					{domToReact(
						domNode.children as DOMNode[],
						child_parser_options
					)}
				</TagName>
			);
		},
	};

	/** Parser options for icon root element */
	const root_parser_options: HTMLReactParserOptions = {
		replace: (domNode) => {
			// Only parse root SVG node
			if (
				!(domNode instanceof Element) ||
				domNode.parent !== null ||
				domNode.name !== 'svg'
			) {
				return <></>;
			}

			return (
				<svg
					viewBox={domNode.attribs.viewBox}
					{...normalizedFillAndStroke({
						attributes: domNode.attribs,
					})}
				>
					{domToReact(
						domNode.children as DOMNode[],
						child_parser_options
					)}
				</svg>
			);
		},
	};

	/** Parsed svg content as a react element */
	const parsedElement:
		React.ReactElement<SVGAttributes<SVGSVGElement>> | undefined =
		useMemo(() => {
			// Sanitize and parse content
			const sanitized_content = safeHTML(content);
			const parsed_content = parse(
				sanitized_content,
				root_parser_options
			);

			let parsed_element: React.JSX.Element | undefined = undefined;

			// Only return an SVG element or undefined
			if (typeof parsed_content !== 'string') {
				if (Array.isArray(parsed_content)) {
					parsed_element = parsed_content.find(
						(element) => element.type === 'svg'
					);
				} else if (parsed_content.type === 'svg') {
					parsed_element = parsed_content;
				}
			}

			if (parsed_element === undefined) {
				onError?.('Content is not a valid SVG.');
			} else {
				onSuccess?.();
			}

			return parsed_element;
		}, [content]);

	/** SVG element with wrapper props */
	const elementWithProps = useMemo(() => {
		const { viewBox = '0 0 24 24', xmlns = 'http://www.w3.org/2000/svg' } =
			parsedElement?.props ?? {};

		return !!parsedElement
			? cloneElement<SVGAttributes<SVGSVGElement>>(parsedElement, {
					...wrapper_props,
					viewBox: wrapper_props.viewBox ?? viewBox,
					xmlns: wrapper_props.xmlns ?? xmlns,
				})
			: undefined;
	}, [parsedElement, wrapper_props]);

	return <>{elementWithProps}</>;
};
