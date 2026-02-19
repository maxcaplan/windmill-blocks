/**
 * @param {Event} e
 * @param {Element} navbar_element
 */
const onHamburgerMenuButtonClick = (e, navbar_element) => {
	e.preventDefault();
	console.log('click', navbar_element);
};

const attachEventListeners = () => {
	document
		.querySelectorAll('.wp-block-windmill-blocks-navbar')
		.forEach((navbar_element) => {
			navbar_element
				.querySelectorAll(
					'.wp-block-windmill-blocks-button.is-hamburger-menu-button'
				)
				.forEach((menu_element) => {
					menu_element.addEventListener('click', (e) =>
						onHamburgerMenuButtonClick(e, navbar_element)
					);
				});
		});
};

window.onload = () => attachEventListeners();
