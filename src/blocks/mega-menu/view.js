(() => {
	/** @typedef {(e: Event) => void} EventCallback */

	/**
	 * @typedef MegaMenu
	 * @property {HTMLElement} element
	 * @property {HTMLElement} menu
	 * @property {HTMLElement} toggle
	 * @property {EventCallback} blurCallback
	 * @property {EventCallback} toggleCallback
	 * @property {EventCallback} menuCallback
	 */

	/** @type {MegaMenu[]} */
	const mega_menus = [];

	/** @type {MegaMenu|undefined} */
	let open_menu = undefined;

	//
	// Functions
	//

	/**
	 * Open a mega menu
	 *
	 * @param {MegaMenu} mega_menu
	 */
	const openMegaMenu = (mega_menu) => {
		open_menu = mega_menu;
		mega_menu.element.setAttribute('data-mega-menu-open', '');
		mega_menu.toggle.setAttribute('aria-expanded', 'true');
		mega_menu.menu.focus();
	};

	/**
	 * Close a mega menu
	 *
	 * @param {MegaMenu} mega_menu
	 */
	const closeMegaMenu = (mega_menu) => {
		open_menu = undefined;
		mega_menu.element.removeAttribute('data-mega-menu-open');
		mega_menu.toggle.setAttribute('aria-expanded', 'false');
	};

	//
	// Event Handlers
	//

	/**
	 * Mega menu blur event handler
	 *
	 * @param {FocusEvent} e
	 * @param {number} menu_index
	 * @param {MegaMenu[]} mega_menus
	 */
	const onMenuBlur = (e, menu_index, mega_menus) => {
		const target_menu =
			menu_index >= 0 && menu_index < mega_menus.length
				? mega_menus[menu_index]
				: undefined;

		if (target_menu === undefined || open_menu !== target_menu) {
			return;
		}

		if (e.relatedTarget === target_menu.toggle) {
			return;
		}

		if (
			!(e.relatedTarget instanceof Node) ||
			!target_menu.menu.contains(e.relatedTarget)
		) {
			closeMegaMenu(target_menu);
		}
	};

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

		// Close all other mega menus
		mega_menus.forEach((menu) => {
			if (target_menu === undefined || menu !== target_menu) {
				menu.element.removeAttribute('data-mega-menu-open');
				menu.toggle.setAttribute('aria-expanded', 'false');
			}
		});

		if (target_menu === undefined) {
			return;
		}

		// Toggle target mega menu
		if (!target_menu.element.hasAttribute('data-mega-menu-open')) {
			openMegaMenu(target_menu);
		} else {
			closeMegaMenu(target_menu);
		}
	};

	/**
	 * Mega menu menu click event handler
	 *
	 * @param {Event} e
	 * @param {number} menu_index
	 * @param {MegaMenu[]} mega_menus
	 */
	const onMenuMenuClick = (e, menu_index, mega_menus) => {
		const target_menu =
			menu_index >= 0 && menu_index < mega_menus.length
				? mega_menus[menu_index]
				: undefined;

		if (target_menu === undefined || open_menu !== target_menu) {
			return;
		}

		if (e.target === target_menu.menu) {
			closeMegaMenu(target_menu);
		}
	};

	/**
	 * Connect mega menu event listeners
	 */
	const connectEventListeners = () => {
		document
			.querySelectorAll('.wp-block-windmill-blocks-mega-menu')
			.forEach((menu_element) => {
				if (menu_element instanceof HTMLElement) {
					const toggle_element = menu_element.querySelector(
						'.wp-block-windmill-blocks-mega-menu-toggle-button'
					);

					const menu_menu_element = menu_element.querySelector(
						'.wp-block-windmill-blocks-mega-menu-menu'
					);

					if (
						toggle_element instanceof HTMLElement &&
						menu_menu_element instanceof HTMLElement
					) {
						const menu_index = mega_menus.length;

						// Create and assign menu blur callback
						const blurCallback = (e) =>
							onMenuBlur(e, menu_index, mega_menus);
						menu_element.addEventListener(
							'blur',
							blurCallback,
							true
						);

						// Create and assign menu toggle callback
						const toggleCallback = (e) =>
							onMenuToggleClick(e, menu_index, mega_menus);
						toggle_element.addEventListener(
							'click',
							toggleCallback
						);

						// Create and assign menu menu click callback
						const menuCallback = (e) =>
							onMenuMenuClick(e, menu_index, mega_menus);
						menu_menu_element.addEventListener(
							'click',
							menuCallback
						);

						// Ensure elements have proper attributes
						toggle_element.setAttribute('aria-expanded', 'false');
						menu_menu_element.setAttribute('tabindex', '-1');

						// Create mega menu object
						mega_menus.push({
							element: menu_element,
							menu: menu_menu_element,
							toggle: toggle_element,
							blurCallback,
							toggleCallback,
							menuCallback,
						});
					}
				}
			});
	};

	// Attach to window load events
	window.addEventListener('load', connectEventListeners);
})();
