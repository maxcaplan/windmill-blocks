import { Panel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { IconPicker } from '@/components';

import { IconModalLibraryComponent } from './types';

/** Icon modal library panel */
export const IconModalLibrary: IconModalLibraryComponent = ({
	selected,
	onSelectedChange,
	onConfirm,
}) => {
	return (
		<Panel className="wm-blocks-icon-modal__library">
			<IconPicker
				selected={selected}
				onSelectedChange={onSelectedChange}
				onConfirm={onConfirm}
			/>
		</Panel>
	);
};
