import * as TypeDefs from '../typedefs';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

/**
 * Internal dependencies
 */
import InlineIcon from '@/components/InlineIcon';

/**
 * Wordpress dependencies
 */
import { Button } from '@wordpress/components';

/**
 * @typedef PickIconControlButtonProps
 * @property {TypeDefs.IconData} iconData
 * @property {boolean} [selected]
 * @property {TypeDefs.IconData} [updatedData]
 * @property {(value: TypeDefs.IconData) => void} [onClick]
 */

/**
 * Icon picker button
 *
 * @param {PickIconControlButtonProps} props
 * @returns {React.JSX.Element}
 */
const PickIconControlButton = (props) => {
	const { iconData, selected, updatedData, onClick } = props;

	/**
	 * Hooks
	 */

	/** @type {React.Ref<import('@/components/InlineIcon').InlineIconRef>} */
	const inlineIconRef = useRef(null);

	useEffect(() => {
		if (inlineIconRef.current === null) {
			return;
		}

		if (updatedData?.filename !== iconData.filename) {
			return;
		}

		inlineIconRef.current.fetchIcon();
	}, [updatedData]);

	/**
	 * Event handlers
	 */

	const onPickIconButtonClick = () => {
		if (selected === true) {
			return;
		}

		onClick?.(iconData);
	};

	return (
		<Button
			onClick={onPickIconButtonClick}
			className={clsx('pick-icon-button', {
				'pick-icon-button__selected': selected === true,
			})}
			title={iconData.filename}
			__next40pxDefaultSize
		>
			<div className="pick-icon-button__inner">
				<div className="pick-icon-button__icon-wrapper">
					<InlineIcon
						ref={inlineIconRef}
						iconData={iconData}
						className="pick-icon-button__icon"
						width={24}
						height={24}
					/>
				</div>
			</div>
		</Button>
	);
};

/**
 * @typedef PickIconButtonDefaultProps
 * @property {boolean} [selected]
 * @property {() => void} [onClick]
 */

/**
 * Icon picker default icon button
 *
 * @param {PickIconButtonDefaultProps} props
 * @returns {React.JSX.Element}
 */
PickIconControlButton.Default = (props) => {
	const { selected, onClick } = props;
	return (
		<Button
			className={clsx('pick-icon-button pick-icon-button__default', {
				'pick-icon-button__selected': selected === true,
			})}
			onClick={() => {
				if (selected !== true) onClick?.();
			}}
			__next40pxDefaultSize
		>
			<small className="pick-icon-button__name">Default</small>
		</Button>
	);
};

export default PickIconControlButton;
