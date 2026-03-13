(() => {
	/** @typedef {(e: Event) => void} ToggleCallback */

	/**
	 * @typedef Navbar
	 * @property {Element} navbar
	 * @property {Element[]} toggles
	 * @property {ToggleCallback[]} toggleCallbacks[]
	 */

	/** @type {Navbar[]} */
	const navbars = [];

	/**
	 * Navbar menu toggle button click event handler
	 *
	 * @param {Event} e
	 * @param {Element} navbar_element
	 */
	const onMenuToggleClick = (e, navbar_element) => {
		e.preventDefault();
		navbar_element.toggleAttribute('data-mobile-menu-open');
	};

	/**
	 * Connect navbar event listeners
	 */
	const connectEventListeners = () => {
		document
			.querySelectorAll('.wp-block-windmill-blocks-navbar')
			.forEach((navbar_element) => {
				/** @type {Navbar} */
				const navbar = {
					navbar: navbar_element,
					toggles: [],
					toggleCallbacks: [],
				};

				navbar_element
					.querySelectorAll(
						'.wp-block-windmill-blocks-navbar-mobile-menu-toggle-button'
					)
					.forEach((toggle_element) => {
						/** @type {ToggleCallback} */
						const toggle_callback = (e) =>
							onMenuToggleClick(e, navbar_element);
						toggle_element.addEventListener(
							'click',
							toggle_callback
						);

						navbar.toggles.push(toggle_element);
						navbar.toggleCallbacks.push(toggle_callback);
					});

				navbars.push(navbar);
			});
	};

	window.addEventListener('load', connectEventListeners);
})();
