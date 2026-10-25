import { useBlockProps } from "@wordpress/block-editor";

/**
 * @type {React.ComponentType<import("@wordpress/blocks").BlockEditProps>}
 */
const Edit = (props) => {
	return <span {...useBlockProps()}>icon</span>
}

export default Edit
