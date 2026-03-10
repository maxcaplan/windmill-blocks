(() => {
	/** @typedef {(e: Event) => void} ToggleCallback */

	/**
	 * @typedef MegaMenu
	 * @property {Element} element
	 * @property {Element} menu
	 * @property {Element} toggle
	 * @property {ToggleCallback} toggleCallback
	 */

	/** @type {MegaMenu[]} */
	const mega_menus = [];

	/** @type {MegaMenu|undefined} */
	let open_menu = undefined;

	/**
	 * Mega menu toggle button click event handler
	 *
	 * @param {Event} e
	 * @param {number} menu_index
	 * @param {MegaMenu[]} mega_menus
	 */
	const onMenuToggleClick = (e, menu_index, mega_menus) => {
		e.preventDefault();

		const target_menu =
			menu_index >= 0 && menu_index < mega_menus.length
				? mega_menus[menu_index]
				: undefined;

		mega_menus.forEach((menu) => {
			if (target_menu === undefined || menu !== target_menu) {
				menu.element.removeAttribute('data-mega-menu-open');
			}
		});

		if (target_menu?.element.toggleAttribute('data-mega-menu-open')) {
			open_menu = target_menu;
		} else {
			open_menu = undefined;
		}
	};

	/**
	 * Connect mega menu event listeners
	 */
	const connectEventListeners = () => {
		document
			.querySelectorAll('.wp-block-windmill-blocks-mega-menu')
			.forEach((menu_element) => {
				const toggle_element = menu_element.querySelector(
					'.wp-block-windmill-blocks-mega-menu-toggle'
				);

				const menu_menu_element = menu_element.querySelector(
					'.wp-block-windmill-blocks-mega-menu-menu'
				);

				if (toggle_element !== null && menu_menu_element !== null) {
					const menu_index = mega_menus.length;

					const toggleCallback = (e) =>
						onMenuToggleClick(e, menu_index, mega_menus);
					toggle_element.addEventListener('click', toggleCallback);

					mega_menus.push({
						element: menu_element,
						menu: menu_menu_element,
						toggle: toggle_element,
						toggleCallback,
					});
				}
			});
	};

	/**
	 * Disconnect mega menu event listeners
	 */
	const disconnectEventListeners = () => {
		if (!Array.isArray(mega_menus)) {
			return;
		}

		mega_menus.forEach((menu) => {
			menu.toggle.removeEventListener('click', menu.toggleCallback);
		});
	};

	window.addEventListener('load', connectEventListeners);
	window.addEventListener('beforeunload', disconnectEventListeners);
})();
