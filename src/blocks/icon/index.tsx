import { registerBlockType } from '@wordpress/blocks';
import { starFilled as blockIcon } from '@wordpress/icons';

import Edit from './edit';

import './styles/style.scss';

import metadata from './block.json';

/** @ts-ignore */
registerBlockType(metadata, {
	icon: blockIcon,
	edit: Edit,
});
