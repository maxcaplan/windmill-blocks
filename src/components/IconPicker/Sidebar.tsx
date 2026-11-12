import clsx from 'clsx';
import { useMemo, useState } from 'react';

import { Button, Panel, PanelBody, NoticeList } from '@wordpress/components';
import { Stack, Tabs, Collapsible, Text, Spinner, Badge } from '@wordpress/ui';
import { closeSmall as closeIcon } from '@wordpress/icons';
import { store as noticeStore } from '@wordpress/notices';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { Icon, PlaceholderGraphic } from '@/components';
import { capitalize, parseFilenameLabel } from '@/util/text';
import { iconStore } from '@/stores';
import { context as iconStoreContext } from '@/stores/icons';

import { SidebarTab } from './constants';
import { IconPickerSidebarComponent } from './types';
import { noticesByStatus } from './util';
import { IconPickerDeleteModal } from './DeleteModal';
import { IconPickerReplaceModal } from './ReplaceModal';

export const IconPickerSidebar: IconPickerSidebarComponent = ({
	activeTab,
	onActiveTabChange,
	selected,
	className,
	onDeleted,
	...props
}) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);

	const icon = useSelect(
		(select) =>
			!!selected ? select(iconStore).getIcon(selected) : undefined,

		[selected]
	);

	const icon_details = useMemo(
		() => [
			{
				label: __('Name'),
				content: icon?.data?.name,
			},
			{
				label: __('File name'),
				content: icon?.data?.basename,
			},
			{
				label: __('Modified'),
				content: icon?.data?.modified,
			},
		],
		[icon]
	);

	const icon_notices = useSelect((select) => {
		return !!selected
			? select(noticeStore)
					.getNotices(iconStoreContext)
					.filter(
						(notice) =>
							notice.type === 'default' &&
							(notice.id === selected ||
								notice.id.startsWith(notice.id + '/'))
					)
			: [];
	});

	const notices = useSelect((select) =>
		noticesByStatus(
			select(noticeStore)
				.getNotices(iconStoreContext)
				.filter((notice) => notice.type === 'default'),
			['error', 'warning']
		)
	);

	const { removeNotice } = useDispatch(noticeStore);

	/**
	 * Check whether a value is of type `SidebarTab`
	 */
	const isSidebarTab = (value: any): value is SidebarTab => {
		return (
			typeof value === 'string' &&
			Object.values(SidebarTab).includes(value as SidebarTab)
		);
	};

	return (
		<>
			<Collapsible.Trigger
				className="wm-blocks-icon-picker-component__overlay"
				nativeButton={false}
				render={<div />}
			/>
			<Collapsible.Panel
				{...props}
				className={clsx(
					'wm-blocks-icon-picker-component__sidebar',
					className
				)}
			>
				<Tabs.Root
					value={
						!activeTab
							? undefined
							: isSidebarTab(activeTab)
								? activeTab
								: SidebarTab.Library
					}
					onValueChange={(value) =>
						onActiveTabChange?.(
							isSidebarTab(value) ? value : SidebarTab.Library
						)
					}
					className="wm-blocks-icon-picker-component__sidebar__panel"
				>
					<Stack
						className="wm-blocks-icon-picker-component__sidebar__header"
						direction="row"
						gap="xs"
						justify="space-between"
						align="center"
					>
						<Tabs.List>
							<Tabs.Tab value={SidebarTab.Library}>
								{__('Library')}
							</Tabs.Tab>

							<Tabs.Tab value={SidebarTab.Icon}>
								{__('Icon')}
							</Tabs.Tab>
						</Tabs.List>

						<Stack
							direction="row"
							gap="xs"
							style={{ flexShrink: 0 }}
						>
							<Collapsible.Trigger
								render={
									<Button
										icon={closeIcon}
										size="compact"
										className="wm-blocks-icon-picker-component__sidebar__toggle"
									/>
								}
							/>
						</Stack>
					</Stack>

					<Tabs.Panel
						value={SidebarTab.Library}
						className="wm-blocks-icon-picker-component__sidebar__tabpanel"
					>
						<Panel header="Notices">
							{notices.map(({ status, notices }) => (
								<>
									{notices.length > 0 && (
										<PanelBody
											title={capitalize(status) + 's'}
											initialOpen={status !== 'other'}
										>
											<NoticeList
												notices={notices}
												className="wm-blocks-icon-picker-component__sidebar__notice-list"
												onRemove={(id) =>
													removeNotice(
														id,
														iconStoreContext
													)
												}
											>
												{notices.length <= 0 && (
													<Text variant="body-sm">
														Nothing to see here
													</Text>
												)}
											</NoticeList>
										</PanelBody>
									)}
								</>
							))}
						</Panel>
					</Tabs.Panel>

					<Tabs.Panel
						value={SidebarTab.Icon}
						className="wm-blocks-icon-picker-component__sidebar__tabpanel"
					>
						<Panel>
							{!selected && (
								<div
									style={{
										textAlign: 'center',
										paddingTop: '32px',
										paddingBottom: '32px',
										paddingLeft: '16px',
										paddingRight: '16px',
									}}
								>
									<Text>No icon selected</Text>
								</div>
							)}

							{!!selected && (
								<>
									<Stack
										className="wm-blocks-icon-picker-component__sidebar__item-card"
										direction="column"
										gap="lg"
									>
										<Stack direction="row" justify="center">
											<span className="wm-blocks-icon-picker-component__sidebar__item-card__icon">
												<Icon
													icon={selected}
													renderLoading={(props) => (
														<Spinner
															{...props}
															width={60}
															height={60}
														/>
													)}
													renderPlaceholder={(
														props
													) => (
														<PlaceholderGraphic
															{...props}
														/>
													)}
												/>
											</span>
										</Stack>

										<Stack
											direction="row"
											gap="md"
											justify="space-between"
										>
											<Text variant="heading-md">
												{parseFilenameLabel(selected)}
											</Text>

											{!!icon?.is_deleted && (
												<Badge
													intent="draft"
													aria-label={__(
														'This icon has been deleted',
														'windmill-data'
													)}
												>
													{__('Deleted')}
												</Badge>
											)}
										</Stack>
									</Stack>

									<PanelBody
										title={__('Notices')}
										initialOpen={false}
									>
										<NoticeList
											notices={icon_notices}
											className="wm-blocks-icon-picker-component__sidebar__notice-list"
											onRemove={(id) =>
												removeNotice(
													id,
													iconStoreContext
												)
											}
										>
											{icon_notices.length <= 0 && (
												<Text variant="body-sm">
													Nothing to see here
												</Text>
											)}
										</NoticeList>
									</PanelBody>

									<PanelBody
										title={__('Details')}
										initialOpen={false}
									>
										<Stack
											className="wm-blocks-icon-picker-component__sidebar__details"
											direction="column"
											gap="lg"
										>
											{icon_details.map(
												({ label, content }) => (
													<Stack
														direction="column"
														justify="start"
														align="start"
														gap="sm"
													>
														<Text
															variant="heading-sm"
															render={<label />}
														>
															{label}
														</Text>
														<Text>
															{content || (
																<span
																	style={{
																		color: 'var(--wpds-color-foreground-content-neutral-weak)',
																	}}
																>
																	{__(
																		'Unknown'
																	)}
																</span>
															)}
														</Text>
													</Stack>
												)
											)}
										</Stack>
									</PanelBody>

									<div className="wm-blocks-icon-picker-component__sidebar__footer">
										<Stack
											className="wm-blocks-icon-picker-component__sidebar__footer__inner"
											direction="row"
											gap="sm"
											justify="end"
										>
											<Button
												isDestructive
												variant="secondary"
												size="compact"
												disabled={
													!!icon?.is_deleted ||
													!icon?.data
												}
												onClick={() =>
													setIsReplaceModalOpen(true)
												}
											>
												{__('Replace')}
											</Button>
											<Button
												isDestructive
												variant="primary"
												size="compact"
												disabled={
													!!icon?.is_deleted ||
													!icon?.data
												}
												onClick={() =>
													setIsDeleteModalOpen(true)
												}
											>
												{__('Delete')}
											</Button>
										</Stack>
									</div>
								</>
							)}
						</Panel>
					</Tabs.Panel>
				</Tabs.Root>

				{!!selected && isDeleteModalOpen && (
					<IconPickerDeleteModal
						selected={selected}
						onCancel={() => setIsDeleteModalOpen(false)}
						onDeleted={(deleted) => {
							setIsDeleteModalOpen(false);
							onDeleted?.(deleted);
						}}
					/>
				)}

				{!!selected && isReplaceModalOpen && (
					<IconPickerReplaceModal
						selected={selected}
						onCancel={() => setIsReplaceModalOpen(false)}
						onConfirm={() => setIsReplaceModalOpen(false)}
					/>
				)}
			</Collapsible.Panel>
		</>
	);
};
