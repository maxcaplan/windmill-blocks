import * as TypeDefs from '../typedefs';

import { useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { NEW_TAB_TARGET, NOFOLLOW_REL } from '../constants';

/**
 * Wordpress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	BlockControls,
	LinkControl,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';
import { Popover } from '@wordpress/components';
import { getUpdatedLinkAttributes } from './get-update-link-attributes';
import { useSelect } from '@wordpress/data';
import { getBlockBindingsSource } from '@wordpress/blocks';
import { createInterpolateElement } from '@wordpress/element';

const LINK_SETTINGS = [
	...LinkControl.DEFAULT_LINK_SETTINGS,
	{
		id: 'nofollow',
		title: __('Mark as nofollow'),
	},
];

/**
 * @typedef ButtonBlockControlsProps
 * @property {Element|null} popoverAnchor
 */

/**
 * Button block editor block controls component
 *
 * @param {TypeDefs.WindmillBlocksButtonEditProps & ButtonBlockControlsProps} props
 * @returns {React.JSX.Element}
 */
export default function ButtonBlockControls(props) {
	const { attributes, setAttributes, isSelected, popoverAnchor, context } =
		props;
	const { url, linkTarget, rel, tagName, metadata } = attributes;

	const opensInNewTab = linkTarget === NEW_TAB_TARGET;
	const nofollow = !!rel?.includes(NOFOLLOW_REL);

	/**
	 * State
	 */
	const [isEditingUrl, setIsEditingUrl] = useState(false);

	/**
	 * Functions
	 */

	const startEditing = () => {
		setAttributes({ tagName: 'a' });
		setIsEditingUrl(true);
	};

	const unlink = () => {
		setAttributes({
			tagName: undefined,
			url: undefined,
			linkTarget: undefined,
			rel: undefined,
		});
		setIsEditingUrl(false);
	};

	const createButtonText = (searchTerm) => {
		return createInterpolateElement(
			sprintf(
				/* translators: %s: search term. */
				__('Create page: <mark>%s</mark>'),
				searchTerm
			),
			{ mark: <mark /> }
		);
	};

	const handleCreate = async (pageTitle) => {
		const page = await createPageEntity({
			title: pageTitle,
			status: 'draft',
		});

		return {
			id: page.id,
			type: page.type,
			title: page.title.rendered,
			url: page.link,
			kind: 'post-type',
		};
	};

	/**
	 * Hooks
	 */

	const {
		createPageEntity,
		userCanCreatePages,
		lockUrlControls = false,
	} = useSelect(
		(select) => {
			if (!isSelected) {
				return {};
			}

			const _settings = select(blockEditorStore).getSettings();

			const blockBindingsSource = getBlockBindingsSource(
				metadata?.bindings?.url?.source
			);

			return {
				createPageEntity: _settings.__experimentalCreatePageEntity,
				userCanCreatePages: _settings.__experimentalUserCanCreatePages,
				lockUrlControls:
					!!metadata?.bindings?.url &&
					!blockBindingsSource?.canUserEditValue?.({
						select,
						context,
						args: metadata?.bindings?.url?.args,
					}),
			};
		},
		[context, isSelected, metadata?.bindings?.url]
	);

	const isUrlSet = useMemo(() => url !== undefined, [url]);

	const linkValue = useMemo(
		() => ({ url, opensInNewTab, nofollow }),
		[url, opensInNewTab, nofollow]
	);

	useEffect(() => {
		if (!isSelected) {
			setIsEditingUrl(false);
		}
	}, [isSelected]);

	/**
	 * Event handlers
	 */

	/**
	 *
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
	 */
	const onLinkButtonClick = (event) => {
		event.preventDefault();

		if (isUrlSet) {
			unlink();
		} else {
			startEditing();
		}
	};

	return (
		<>
			<BlockControls group="block">
				<ToolbarButton
					icon={isUrlSet ? linkOff : link}
					title={isUrlSet ? __('Unlink') : __('Link')}
					isActive={isUrlSet}
					onClick={onLinkButtonClick}
				/>
			</BlockControls>

			{isSelected && (isEditingUrl || isUrlSet) && !lockUrlControls && (
				<Popover
					placement="bottom"
					anchor={popoverAnchor}
					focusOnMount={isEditingUrl ? 'firstElement' : false}
					onClose={() => setIsEditingUrl(false)}
					__unstableSlotName="__unstable-block-tools-after"
					shift
				>
					<LinkControl
						value={linkValue}
						onChange={(value) =>
							setAttributes(
								getUpdatedLinkAttributes({
									rel: rel || '',
									url: value?.url || '',
									opensInNewTab: !!value?.opensInNewTab,
									nofollow: !!value?.nofollow,
								})
							)
						}
						onRemove={unlink}
						forceIsEditingLink={isEditingUrl}
						settings={LINK_SETTINGS}
						createSuggestion={createPageEntity && handleCreate}
						withCreateSuggestion={userCanCreatePages}
						createSuggestionButtonText={createButtonText}
					/>
				</Popover>
			)}
		</>
	);
}
