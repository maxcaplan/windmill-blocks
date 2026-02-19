/**
 * @param {Event} e
 * @param {Element} navbar_element
 */
const onHamburgerMenuButtonClick = (e, navbar_element) => {
	e.preventDefault();
	navbar_element.toggleAttribute('data-mobile-menu-open');
};

const attachEventListeners = () => {
	document
		.querySelectorAll('.wp-block-windmill-blocks-navbar')
		.forEach((navbar_element) => {
			navbar_element
				.querySelectorAll(
					'.wp-block-windmill-blocks-navbar-mobile-menu-toggle-button'
				)
				.forEach((menu_element) => {
					menu_element.addEventListener('click', (e) =>
						onHamburgerMenuButtonClick(e, navbar_element)
					);
				});
		});
};

window.onload = () => attachEventListeners();
