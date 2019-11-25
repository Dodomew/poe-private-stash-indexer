// function initAccordion() {
//     if(!$('.js-accordion-item').length || !$('.js-accordion').length) {
//         return;
//     }
//
//     // Accordion expand / close toggle
//     $('.js-accordion-item').each(function () {
//         var $this = $(this),
//             $panel = $this.find('.js-accordion-panel'),
//             $height = $panel.height() + 1000;
//
//         $panel.css('max-height', $height);
//
//         if ($panel.hasClass('is-hidden')) {
//             $panel.removeClass('is-hidden').addClass('is-closed');
//         }
//
//         $this.find('a').attr("tabindex", "-1");
//     });
//
//     $('.js-accordion').on('click', '.js-accordion-toggle', function (e) {
//         e.preventDefault();
//         var $parent = $(this).closest('.js-accordion-item'),
//             $panel = $parent.find('.js-accordion-panel'),
//             $state = $parent.find('.js-accordion-state');
//         $panel.toggleClass('is-closed is-expanded');
//         $parent.toggleClass('is-active');
//
//         // Set current state label
//         var stateLabel = $parent.hasClass('is-active') ? 'open' : 'closed';
//
//         // Toggle Aria attributes
//         $panel.attr('aria-hidden', (stateLabel === 'closed' ? 'true' : 'false'));
//         $state.attr('aria-expanded', (stateLabel === 'closed' ? 'false' : 'true'));
//
//         $state.find('.js-accordion-toggle-screenreader').text($state.data('state-' + stateLabel));
//         $('.js-accordion-screenreader').text($('.js-accordion-screenreader').data('accordion-item-' + stateLabel));
//
//         // make links inside accordion only tab-able when accordion item is active
//         $parent.find('a').attr("tabindex", $parent.hasClass('is-active') - 1);
//
//         trackEvent('Component: Accordion', stateLabel === 'open' ? 'Open' : 'Close', $parent.attr('data-track-label'));
//     });
// }

function initAccordion(htmlWrapper) {
    let allAccordions = htmlWrapper.getElementsByClassName('js-accordion');

    for (let i = 0; i < allAccordions.length; i++) {
        let heightOfElement = allAccordions[i].offsetHeight;
        allAccordions[i].style.height = heightOfElement + "px";
        allAccordions[i].style.maxHeight = heightOfElement + "px";
        allAccordions[i].classList.add('is-closed');
    }
}
