(() => {
	const MOBILE_MENU_OPEN_DATA_KEY = 'mobileMenuOpen';
	const DESKTOP_DISPLAY_DATA_KEY = 'navbarDesktop';
	const MOBILE_DISPLAY_DATA_KEY = 'navbarMobile';

	/**
	 * Close a navbars mobile menu
	 *
	 * @param {HTMLElement} navbar_element
	 */
	const close_navbar_mobile_menu = (navbar_element) => {
		delete navbar_element.dataset[MOBILE_MENU_OPEN_DATA_KEY];
	};

	/**
	 * Open a navbars mobile menu
	 *
	 * @param {HTMLElement} navbar_element
	 */
	const open_navbar_mobile_menu = (navbar_element) => {
		navbar_element.dataset[MOBILE_MENU_OPEN_DATA_KEY] = 'true';
	};

	/**
	 * Check whether a navbars mobile menu is open
	 *
	 * @param {HTMLElement} navbar_element
	 */
	const is_navbar_mobile_menu_open = (navbar_element) => {
		return !!navbar_element.dataset[MOBILE_MENU_OPEN_DATA_KEY];
	};

	/**
	 * Navbar menu toggle button click event handler
	 *
	 * @param {Event} event
	 * @param {HTMLElement} navbar_element
	 */
	const onMenuToggleClick = (event, navbar_element) => {
		event.preventDefault();

		// Toggle navbar menu open data attribute
		if (is_navbar_mobile_menu_open(navbar_element)) {
			close_navbar_mobile_menu(navbar_element);
		} else {
			open_navbar_mobile_menu(navbar_element);
		}
	};

	/**
	 * Set a navbar elements respective properties for a breakpoint
	 *
	 * @param {HTMLElement} navbar_element
	 * @param {boolean} is_desktop
	 */
	const set_navbar_breakpoint_properties = (navbar_element, is_desktop) => {
		if (is_desktop) {
			// Close mobile menu if open
			if (is_navbar_mobile_menu_open(navbar_element)) {
				close_navbar_mobile_menu(navbar_element);
			}

			// Set desktop and mobile display vars
			navbar_element.dataset[DESKTOP_DISPLAY_DATA_KEY] = 'true';
			delete navbar_element.dataset[MOBILE_DISPLAY_DATA_KEY];
		} else {
			// Set desktop and mobile display vars
			delete navbar_element.dataset[DESKTOP_DISPLAY_DATA_KEY];
			navbar_element.dataset[MOBILE_DISPLAY_DATA_KEY] = 'true';
		}
	};

	/**
	 * Navbar media query change event handler
	 *
	 * @param {MediaQueryListEvent} event
	 * @param {HTMLElement} navbar_element
	 */
	const onNavbarMediaChange = (event, navbar_element) => {
		set_navbar_breakpoint_properties(navbar_element, !event.matches);
	};

	/**
	 * Connect navbar event listeners
	 */
	const connectEventListeners = () => {
		document
			.querySelectorAll('.wp-block-windmill-blocks-navbar')
			.forEach((navbar_element) => {
				if (navbar_element instanceof HTMLElement) {
					// Connect navbar toggles click event listeners
					navbar_element
						.querySelectorAll(
							'.wp-block-windmill-blocks-navbar-mobile-menu-toggle-button'
						)
						.forEach((toggle_element) => {
							toggle_element.addEventListener('click', (e) =>
								onMenuToggleClick(e, navbar_element)
							);
						});

					// Ensure navbar mobile menu starts closed
					close_navbar_mobile_menu(navbar_element);

					// Create media query for navbar desktop breakpoint
					const navbar_media_query = window.matchMedia(
						`(max-width: ${navbar_element.dataset.desktopBreakpoint ?? '600px'})`
					);

					// Set navbar initial breakpoint properties
					set_navbar_breakpoint_properties(
						navbar_element,
						!navbar_media_query.matches
					);

					// Attach media query change event
					navbar_media_query.addEventListener('change', (e) =>
						onNavbarMediaChange(e, navbar_element)
					);
				}
			});
	};

	window.addEventListener('load', connectEventListeners);
})();
