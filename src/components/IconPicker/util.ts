/**
 * Create an array of notice arrays sorted by provided statuses
 */
export const noticesByStatus = <
	Notice extends { status: string },
	Status extends string = 'error' | 'warning',
>(
	notices: Notice[],
	statuses: Status[] = ['error' as Status, 'warning' as Status]
) => {
	const map = notices.reduce(
		(status_map, notice) => {
			let status_key = (
				statuses.includes(notice.status as Status)
					? notice.status
					: 'other'
			) as Status | 'other';

			if (!!status_map[status_key]) {
				status_map[status_key].push(notice);
			} else {
				status_map[status_key] = [notice];
			}

			return status_map;
		},
		{} as Record<Status | 'other', Notice[] | undefined>
	);

	return [...statuses, 'other'].map((status) => ({
		status: status as Status | 'other',
		notices: (map[status] ?? []) as Notice[],
	}));
};
