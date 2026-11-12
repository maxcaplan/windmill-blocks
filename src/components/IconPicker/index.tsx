import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button, Icon as WCIcon } from '@wordpress/components';
import {
	Stack,
	Collapsible,
	Badge,
	Tooltip,
	Spinner,
	Notice,
} from '@wordpress/ui';
import {
	DataViewsPicker,
	View,
	Field,
	filterSortAndPaginate,
	ViewPickerGrid,
	ViewPickerTable,
} from '@wordpress/dataviews';
import {
	error as errorIcon,
	drawerRight as sidebarIcon,
	rotateRight as reloadIcon,
} from '@wordpress/icons';
import { store as noticeStore } from '@wordpress/notices';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { Icon, PlaceholderGraphic } from '@/components';
import { useIconNames } from '@/hooks';
import { parseFilenameLabel, pluralize } from '@/util/text';
import { iconStore } from '@/stores';
import { context as iconStoreContext, ICON_STATUS } from '@/stores/icons';

import { IconPickerSidebar } from './Sidebar';
import { SidebarTab } from './constants';
import { IconPickerDataItem, IconPickerComponent } from './types';

import './styles.scss';
import { parseErrorMessage } from '@/util/error';

const icon_picker_fields: Field<IconPickerDataItem>[] = [
	{
		id: 'label',
		label: __('Name'),
		type: 'text',
		enableGlobalSearch: true,
		enableSorting: true,
		readOnly: true,
		filterBy: {
			operators: ['contains', 'notContains', 'startsWith'],
		},
		render: ({ item }) => {
			const { status } = useSelect(
				(select) => select(iconStore).getIcon(item.id),
				[item.id]
			);

			return (
				<Stack
					className="wm-blocks-icon-picker-component__item__title'"
					direction="row"
					gap="sm"
					justify="space-between"
					align="center"
					wrap="nowrap"
				>
					<span className="wm-blocks-icon-picker-component__item__title__label">
						{item.label}
					</span>

					{status === ICON_STATUS.ERROR && (
						<WCIcon icon={errorIcon} />
					)}
				</Stack>
			);
		},
	},
	{
		id: 'icon',
		type: 'media',
		label: __('Icon'),
		readOnly: true,
		render: ({ item }) => {
			return (
				<span className="wm-blocks-icon-picker-component__item__icon">
					<Icon
						icon={item.id}
						renderLoading={({ ...props }) => (
							<Spinner {...props} width={60} height={60} />
						)}
						renderPlaceholder={(props) => (
							<PlaceholderGraphic {...props} />
						)}
					/>
				</span>
			);
		},
	},
	{
		id: 'error',
		type: 'integer',
		label: __('Errors'),
		readOnly: true,
		getValue: ({ item }) =>
			// Get error notice count for item id
			select(noticeStore)
				.getNotices(iconStoreContext)
				.filter(
					(notice) =>
						notice.status === 'error' &&
						(notice.id === item.id ||
							notice.id.startsWith(item.id + '/'))
				).length,
		render: ({ item, field }) => (
			<span
				className={
					field.getValue({ item }) > 0
						? 'wm-blocks-icon-picker-component__item--has-errors'
						: 'wm-blocks-icon-picker-component__item--no-errors'
				}
			>
				Errors: {field.getValueFormatted({ item, field })}
			</span>
		),
	},
];

const icon_picker_default_layouts: {
	pickerGrid: Omit<ViewPickerGrid, 'type'>;
	pickerTable: Omit<ViewPickerTable, 'type'>;
} = {
	pickerGrid: {
		sort: {
			field: 'label',
			direction: 'asc',
		},
		layout: {
			density: 'comfortable',
			previewSize: 170,
			badgeFields: ['error'],
		},
	},
	pickerTable: {
		sort: {
			field: 'label',
			direction: 'asc',
		},
		layout: {
			density: 'balanced',
		},
	},
};

/**
 * Displays an icon library data view for picking an icon
 */
export const IconPicker: IconPickerComponent = ({
	selected,
	onSelectedChange,
	onConfirm,
	onCancel,
	className,
	...props
}) => {
	const pickerRef = useRef<HTMLDivElement>(null);
	const scrollToSelection = useRef(false);

	const [view, setView] = useState<View>({
		type: 'pickerGrid',
		...icon_picker_default_layouts.pickerGrid,
		titleField: 'label',
		mediaField: 'icon',
		showTitle: true,
		showMedia: true,
	});
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [sidebarTab, setSidebarTab] = useState<SidebarTab>(
		SidebarTab.Library
	);
	const [selection, setSelection] = useState<string[]>(
		!selected ? [] : [selected]
	);

	const {
		data: icon_names,
		error: icon_names_error,
		isLoading,
		refetchNames,
	} = useIconNames({
		onSuccess: () => {
			scrollToSelection.current = true;
		},
	});

	const { refetchIconData } = useDispatch(iconStore);

	/** Text to display in the error badge */
	const error_badge_text = useSelect((select) => {
		const error_count = select(noticeStore)
			.getNotices(iconStoreContext)
			.filter(
				(notice) =>
					notice.type === 'default' && notice.status === 'error'
			).length;

		return error_count <= 0
			? undefined
			: pluralize('Error', error_count, { with_prefix: true });
	});

	/** Currently selected item determined by internal state or prop */
	const current_selection = useMemo(() => {
		if (selected === undefined) {
			return selection;
		}

		return !selected ? [] : [selected];
	}, [selected, selection]);

	/** Data that hasn't been sorted, filtered, and paginated */
	const unsorted_data: IconPickerDataItem[] = useMemo(
		() =>
			(icon_names ?? []).map((icon) => {
				return {
					id: icon,
					label: parseFilenameLabel(icon),
				};
			}),
		[icon_names]
	);

	/**
	 * Reload all icon data
	 */
	const reloadIcons = () => {
		if (!isLoading) {
			// Refetch all current icons and refetch all icon names
			icon_names?.forEach((name) => refetchIconData(name));
			refetchNames();
		}
	};

	// Sort, filter, and paginate data
	const { data, paginationInfo } = useMemo(
		() => filterSortAndPaginate(unsorted_data, view, icon_picker_fields),
		[unsorted_data, view]
	);

	// Switch to icon sidebar tab when icon selected
	useEffect(() => {
		if (current_selection.length > 0) {
			setSidebarTab(SidebarTab.Icon);
		}
	}, [current_selection]);

	// Scroll selection into view
	useEffect(() => {
		if (!scrollToSelection || !pickerRef.current || data.length <= 0) {
			return;
		}

		pickerRef.current
			.querySelector('.is-selected')
			?.scrollIntoView({ behavior: 'instant' });

		scrollToSelection.current = false;
	}, [scrollToSelection, pickerRef, data]);

	return (
		<Collapsible.Root
			{...props}
			ref={pickerRef}
			className={clsx('wm-blocks-icon-picker-component', className)}
			open={sidebarOpen}
			onOpenChange={(open) => setSidebarOpen(open)}
		>
			<DataViewsPicker
				isLoading={isLoading}
				empty={
					!icon_names_error ? (
						'No results'
					) : (
						<Notice.Root
							intent="error"
							style={{ width: '100%', alignSelf: 'start' }}
						>
							<Notice.Title>
								{__('Failed to load library')}
							</Notice.Title>

							<Notice.Description>
								{parseErrorMessage(icon_names_error)}
							</Notice.Description>

							<Notice.Actions>
								<Notice.ActionButton
									onClick={() => refetchNames()}
								>
									{__('Retry')}
								</Notice.ActionButton>
							</Notice.Actions>
						</Notice.Root>
					)
				}
				selection={current_selection}
				onChangeSelection={(value) => {
					setSelection(value);
					onSelectedChange?.(value.at(-1) ?? null);
				}}
				view={view}
				onChangeView={setView}
				paginationInfo={paginationInfo}
				config={{
					perPageSizes: [],
					mediaFitControl: false,
				}}
				defaultLayouts={icon_picker_default_layouts}
				itemListLabel={__('Icon library items', 'windmill-blocks')}
				actions={[
					{
						id: 'cancel',
						label: __('Cancel'),
						isPrimary: false,
						supportsBulk: false,
						disabled: false,
						callback: () => onCancel?.(),
					},
					{
						id: 'select',
						label: __('Select'),
						isPrimary: true,
						supportsBulk: false,
						isEligible: (item) =>
							select(iconStore).getIconStatus(item.id) ===
							ICON_STATUS.LOADED,
						callback: (items) => {
							const icon_name = items.at(-1)?.id;

							if (icon_name !== undefined) {
								onConfirm?.(icon_name);
							}
						},
					},
				]}
				data={data}
				fields={icon_picker_fields}
			>
				<Stack
					direction="row"
					align="top"
					justify="space-between"
					className="dataviews__view-actions"
					gap="xs"
				>
					<Stack
						direction="row"
						gap="sm"
						justify="start"
						className="dataviews__search"
					>
						<DataViewsPicker.Search />
						<DataViewsPicker.FiltersToggle />
						<div>
							<Button
								icon={reloadIcon}
								label={__('Reload library')}
								size="compact"
								disabled={isLoading}
								onClick={reloadIcons}
							/>
						</div>
					</Stack>

					<Stack direction="row" gap="md" style={{ flexShrink: 0 }}>
						{!!error_badge_text && (
							<Tooltip.Root>
								<Tooltip.Trigger
									role="button"
									aria-label={__(
										'View icon library errors',
										'windmill-blocks'
									)}
									onClick={() => {
										setSidebarTab(SidebarTab.Library);
										setSidebarOpen(true);
									}}
									style={{
										alignSelf: 'center',
										cursor: 'pointer',
									}}
									render={(props) => (
										<Badge intent="medium" {...props}>
											{error_badge_text}
										</Badge>
									)}
								/>

								<Tooltip.Popup
									positioner={
										<Tooltip.Positioner side="bottom" />
									}
								>
									{__(
										'View icon library errors',
										'windmill-blocks'
									)}
								</Tooltip.Popup>
							</Tooltip.Root>
						)}

						<Stack direction="row" gap="sm">
							<DataViewsPicker.LayoutSwitcher />
							<DataViewsPicker.ViewConfig />

							<Collapsible.Trigger
								render={
									<Button
										icon={sidebarIcon}
										label={__('Sidebar')}
										isPressed={sidebarOpen}
										size="compact"
										className={clsx(
											'wm-blocks-icon-picker-component__sidebar__toggle'
										)}
									/>
								}
							/>
						</Stack>
					</Stack>
				</Stack>

				<DataViewsPicker.FiltersToggled className="dataviews-filters__container" />

				<DataViewsPicker.Layout />

				<DataViewsPicker.Footer />
			</DataViewsPicker>

			<IconPickerSidebar
				activeTab={sidebarTab}
				onActiveTabChange={setSidebarTab}
				selected={current_selection.at(-1)}
				onDeleted={() => {
					// Clear selection
					setSelection([]);
					onSelectedChange?.(null);

					// Refetch icon names
					refetchNames();
				}}
			/>
		</Collapsible.Root>
	);
};
