/**
 * Wordpress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Editor styles
 */
import './styles/editor.scss';

/**
 * Block editor component
 *
 * @param {import('@wordpress/blocks').BlockEditProps<{}>} props
 * @returns {React.JSX.Element}
 */
export default function Edit(props) {
	return <div {...useBlockProps()}></div>;
}
