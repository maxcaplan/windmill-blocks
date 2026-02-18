import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import { pick } from 'lodash';
import {
	default as parseHtml,
	Element,
	attributesToProps,
	domToReact,
} from 'html-react-parser';

/**
 * Internal dependencies
 */
import { isIconData } from './util';
import useGetSvgContents from '@/hooks/use-get-svg-contents';

/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { Icon } from '@wordpress/components';

/**
 * Typedefs
 */

/**
 * @typedef IconData
 * @property {string} filename
 * @property {string} basename
 * @property {string} url
 */

/**
 * @typedef InlineIconRef
 * @property {() => Promise<void>} fetchIcon
 */

/**
 * @typedef InlineIconProps
 * @property {string} [src]
 * @property {string} [iconName]
 * @property {IconData} [iconData]
 * @property {import('@wordpress/components').IconType} [placeholder]
 * @property {string} [className]
 * @property {number|string} [width]
 * @property {number|string} [height]
 * @property {string} [ariaLabel]
 */

/**
 * @typedef InlineIconInnerProps
 * @property {string} [content]
 * @property {string} [className]
 * @property {number} [width]
 * @property {number} [height]
 * @property {string} [ariaLabel]
 * @property {import('@wordpress/components').IconType} [placeholder]
 */

/**
 * Hooks
 */

/**
 * Get an inline icon for an icon name
 *
 * @param {string} [icon]
 */
const useGetIconData = (icon) => {
	const [iconData, setIconData] = useState(
		/** @type {IconData|undefined} */ (undefined)
	);

	const [fetchIconController, setFetchIconController] = useState(
		/** @type {AbortController|undefined} */ (undefined)
	);

	/** @param {AbortController} [controller] */
	const fetchIconData = async (icon_filename, controller) => {
		try {
			// Ensure nonce value is set
			if (wpApiSettings?.nonce === undefined) {
				throw new Error('Invalid credentials.', {
					cause: 'wpApiSettings.nonce is undefined',
				});
			}

			// Register nonce authentication
			apiFetch.use(apiFetch.createNonceMiddleware(wpApiSettings.nonce));

			const results = await apiFetch({
				path: `/windmill-blocks/v1/icons/${icon_filename}.svg`,
				method: 'GET',
				signal: controller?.signal,
			});

			if (!isIconData(results)) {
				throw new Error('Unknown response.');
			}

			setIconData(results);
		} catch (err) {
			console.error(err);
		}
	};

	// Get url for icon name
	useEffect(() => {
		if (icon === undefined) {
			return undefined;
		}

		if (fetchIconController !== undefined) {
			fetchIconController.abort();
		}

		const controller =
			typeof AbortController === 'undefined'
				? undefined
				: new AbortController();

		setFetchIconController(controller);

		fetchIconData(icon, controller);
	}, [icon]);

	return iconData;
};

/**
 * Static Functions
 */

/** @param {string|number} [size] */
const parseSize = (size) => {
	if (size === undefined || typeof size === 'number') {
		return size;
	}

	const parsed_size = parseInt(size);
	return Number.isNaN(parsed_size) ? undefined : parsed_size;
};

/**
 * Components
 */

/**
 * @param {InlineIconInnerProps} props
 * @returns {React.JSX.Element}
 */
const InlineIconDefaultIcon = (props) => {
	const { placeholder, width, height, ariaLabel, className } = props;

	return (
		<Icon
			icon={placeholder}
			width={width}
			height={height}
			aria-label={ariaLabel}
			className={className}
			fill="currentColor"
		/>
	);
};

/**
 * @param {InlineIconInnerProps} props
 * @returns {React.JSX.Element}
 */
const InlineIconInner = (props) => {
	const { content, placeholder, className, ariaLabel, width, height } = props;

	/** @type {import('html-react-parser').HTMLReactParserOptions} */
	const parser_options = {
		trim: true,
		replace: (dom_node, index) => {
			if (
				index !== 0 ||
				!(dom_node instanceof Element) ||
				dom_node.name !== 'svg'
			) {
				return;
			}

			return (
				<svg
					{...attributesToProps(dom_node.attribs)}
					id={undefined}
					className={className}
					width={width}
					height={height}
					aria-label={ariaLabel}
					preserveAspectRatio="xMidYMid meet"
				>
					{/** @ts-ignore */}
					{domToReact(dom_node.children, parser_options)}
				</svg>
			);
		},
	};

	const content_element = useMemo(() => {
		if (content === undefined) {
			return undefined;
		}

		const element = parseHtml(content, parser_options);

		if (
			typeof element === 'string' ||
			Array.isArray(element) ||
			element.type !== 'svg'
		) {
			return undefined;
		}

		return element;
	}, [content, className, width, height, ariaLabel]);

	return (
		<>
			{content_element === undefined && (
				<InlineIconDefaultIcon
					className={className}
					width={width}
					height={height}
					ariaLabel={ariaLabel}
					placeholder={placeholder}
				/>
			)}
			{content_element}
		</>
	);
};

/**
 * Render an svg inline from a given source
 */
const InlineIcon = forwardRef(
	/** @type {(props: InlineIconProps, ref: React.ForwardedRef<InlineIconRef>) => React.JSX.Element} */
	(props, ref) => {
		const {
			src,
			iconName,
			iconData,
			placeholder,
			className,
			width,
			height,
			ariaLabel,
		} = props;

		/**
		 * Hooks
		 */

		const fetchedIconData = useGetIconData(iconName);

		const iconSrc = useMemo(() => {
			if (src !== undefined) {
				return src;
			}

			if (iconData !== undefined) {
				return iconData.url;
			}

			if (iconName !== undefined) {
				return fetchedIconData?.url;
			}

			return undefined;
		}, [iconName, iconData, fetchedIconData]);

		const iconWidth = useMemo(() => parseSize(width), [width]);
		const iconHeight = useMemo(() => parseSize(height), [height]);

		const [iconContent, fetchIcon] = useGetSvgContents(iconSrc);

		useImperativeHandle(ref, () => ({
			fetchIcon,
		}));

		return (
			<InlineIconInner
				content={iconContent}
				className={className}
				width={iconWidth}
				height={iconHeight}
				ariaLabel={ariaLabel}
				placeholder={placeholder}
			/>
		);
	}
);

export default InlineIcon;
