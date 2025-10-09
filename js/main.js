$(function() { // Shorthand for $(document).ready()

    // =======================================================
    // UNIVERSAL SLIDER FACTORY (FINAL & CORRECTED)
    // =======================================================
    /**
     * Creates a generic, configurable slider.
     * @param {object} options - The configuration for the slider.
     */
    function createSlider(options) {
        const $container = $(options.containerSelector);
        if (!$container.length) {
            return; // Don't run if the slider's container isn't on the current page
        }

        let currentIndex = 0;
        const totalSlides = options.data.length;
        const $dotsContainer = $(options.dotsSelector);

        // Run the one-time setup function to build initial HTML if provided
        if (options.setup) {
            options.setup($container, options.data);
        }

        // --- Core Render Function ---
        const render = (index) => {
            // Run the unique render logic for this specific slider
            if (options.render) {
                options.render(index, options.data);
            }
            // Update the active state of the dots
            if ($dotsContainer.length) {
                $dotsContainer.children().each(function(i) {
                    $(this).toggleClass('active', i === index);
                });
            }
        };

        // --- Navigation ---
        $(options.nextSelector).on('click', function() {
            currentIndex = (currentIndex + 1) % totalSlides;
            render(currentIndex);
        });

        $(options.prevSelector).on('click', function() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            render(currentIndex);
        });

        // --- Dots Generation (with fix) ---
        if ($dotsContainer.length) {
            $dotsContainer.empty(); // Clear any existing dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = $('<span>')
                    .addClass('dot') // THE CRUCIAL FIX IS HERE
                    .on('click', function() {
                        currentIndex = i;
                        render(currentIndex);
                    });
                $dotsContainer.append(dot);
            }
        }

        // --- Initial Render ---
        render(currentIndex);

        // --- Recalculate on Resize (for sliders that need it) ---
        if (options.recalculateOnResize && options.render) {
            $(window).on('resize', () => {
                setTimeout(() => render(currentIndex), 200);
            });
        }
    }


    // =======================================================
    // SLIDER CONFIGURATIONS
    // =======================================================

    // --- 1. Ongoing Projects Slider (Homepage) ---
    // Requires section with id="ongoing-projects-slider"
    const projects = [
        { name: 'ATREYAA', image: 'assets/images/image/Rectangle 41.png', link: '#' },
        { name: 'NIRMALA', image: 'assets/images/image/Rectangle 41.png', link: '#' },
        { name: 'VISTA', image: 'assets/images/image/Rectangle 41.png', link: '#' },
        { name: 'HERITAGE', image: 'assets/images/image/Rectangle 41.png', link: '#' }
    ];
    createSlider({
        containerSelector: '#ongoing-projects-slider',
        data: projects,
        nextSelector: '#project-next',
        prevSelector: '#project-prev',
        dotsSelector: '#project-dots',
        setup: ($container, data) => {
            const $sliderContainer = $container.find('#slider-container');
            $sliderContainer.empty();
            data.forEach((p, i) => {
                $('<img>', {
                    src: p.image, alt: p.name,
                    class: `absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i !== 0 ? 'opacity-0' : ''}`
                }).appendTo($sliderContainer);
            });
        },
        render: (index, data) => {
            const project = data[index];
            $('#slider-container').children().each((i, el) => $(el).toggleClass('opacity-100 opacity-0', i === index));
            $('#project-name').text(project.name);
            $('#project-link').attr('href', project.link);
        }
    });

    // --- 2. Testimonial Slider (Homepage) ---
    // Requires section with id="testimonial-slider"
    const testimonials = [
        { name: 'Amit Agarwal', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...', image: 'assets/images/image/Rectangle 47.png', avatar: 'assets/images/image/Ellipse 6.png' },
        { name: 'Priya Singh', text: 'Aliquam in hendrerit urna. Sed non risus...', image: 'assets/images/image/Rectangle 47.png', avatar: 'assets/images/image/Ellipse 7.png' },
        { name: 'Rahul Kumar', text: 'Pellentesque sit amet sapien fringilla, mattis ligula...', image: 'assets/images/image/Rectangle 47.png', avatar: 'assets/images/image/Ellipse 8.png' },
        { name: 'Sunita Sharma', text: 'Cras elementum ultrices diam. Maecenas ligula massa...', image: 'assets/images/image/Rectangle 47.png', avatar: 'assets/images/image/Ellipse 9.png' }
    ];
    createSlider({
        containerSelector: '#testimonial-slider',
        data: testimonials,
        nextSelector: '#testimonial-next',
        prevSelector: '#testimonial-back',
        dotsSelector: '#testimonial-dots',
        setup: ($container, data) => {
            const $avatars = $('#testimonial-avatars');
            $avatars.empty();
            data.forEach((t, i) => {
                const $avatar = $('<img>', { src: t.avatar, class: 'avatar' });
                // We need to re-bind the click event here to call the main render function
                $avatar.on('click', () => {
                    // This is a special case where a separate element controls the slider
                    // We manually find the slider's own render function
                    const sliderInstance = $container.data('sliderInstance');
                    if (sliderInstance) sliderInstance.render(i);
                });
                $avatars.append($avatar);
            });
        },
        render: (index, data) => {
            const testimonial = data[index];
            $('#testimonial-card').animate({ opacity: 0 }, 150, function() {
                $('#testimonial-name').text(testimonial.name);
                $('#testimonial-text').text(testimonial.text);
                $('#testimonial-image').attr('src', testimonial.image);
                $(this).animate({ opacity: 1 }, 150);
            });
            $('#testimonial-avatars').children().each((i, el) => $(el).toggleClass('active', i === index));
        }
    });
    // Store the render function on the container for the avatar clicks
    if ($('#testimonial-slider').length) {
         $('#testimonial-slider').data('sliderInstance', {
            render: (index) => {
                // Manually trigger update for testimonial slider
                // This is a simplified way; a more advanced factory would return an API
                $('#testimonial-dots').children().eq(index).trigger('click');
            }
        });
    }

    // --- 3. Master Plan Slider (Homepage & Project Page) ---
    // Requires section with id="masterplan-slider"
    const masterPlans = [
        { image: 'assets/images/image/building-1.png', description: 'AN Group redefines urban living...' },
        { image: 'images/master-plan-2.jpg', description: 'This is the second floor plan...' },
        { image: 'images/master-plan-3.jpg', description: 'The third master plan highlights...' }
    ];
    createSlider({
        containerSelector: '#masterplan-slider',
        data: masterPlans,
        nextSelector: '#masterplan-next',
        prevSelector: '#masterplan-back',
        dotsSelector: '#masterplan-dots',
        setup: ($container, data) => {
            const $planContainer = $container.find('#masterplan-slider-container');
            $planContainer.empty();
            data.forEach((plan, i) => {
                $('<img>', {
                    src: plan.image, alt: `Master Plan ${i + 1}`,
                    class: `absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${i !== 0 ? 'opacity-0' : ''}`
                }).appendTo($planContainer);
            });
        },
        render: (index, data) => {
            const plan = data[index];
            $('#masterplan-slider-container').children().each((i, el) => $(el).toggleClass('opacity-100 opacity-0', i === index));
            $('#masterplan-description').animate({ opacity: 0 }, 150, function() {
                $(this).text(plan.description).animate({ opacity: 1 }, 150);
            });
        }
    });

    // --- 4. Amenities Slider (Project Page) ---
    // Requires section with id="amenities-slider"
    const amenitiesData = [
        { name: 'Card Room', image: 'assets/images/image/building-1.png' },
        { name: 'Gymnasium', image: 'assets/images/image/building-1.png' },
        { name: 'Lift Lobby', image: 'assets/images/image/building-1.png' },
        { name: 'Rooftop Garden', image: 'assets/images/image/building-1.png' },
        { name: 'Community Hall', image: 'assets/images/image/building-1.png' },
    ];
    createSlider({
        containerSelector: '#amenities-slider',
        data: amenitiesData,
        nextSelector: '#amenities-next',
        prevSelector: '#amenities-back',
        dotsSelector: '#amenities-dots',
        recalculateOnResize: true,
        setup: ($container, data) => {
            const $track = $('#amenities-track');
            $track.empty();
            data.forEach(item => {
                const card = `
                    <div class="amenity-card flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4">
                        <div class="justify-start">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-auto object-cover  mb-4">
                            <h3 class="text-xl font-semibold text-black">${item.name}</h3>
                        </div>
                    </div>`;
                $track.append(card);
            });
        },
        render: (index) => {
            const $slides = $('.amenity-card');
            if (!$slides.length) return;
            const slideWidth = $slides.first().outerWidth();
            $('#amenities-track').css('transform', `translateX(-${index * slideWidth}px)`);
        }
    });

    // --- Tabbed Sliders (Floor Plans & Gallery) ---
    function initializeTabbedSlider(config) {
        if (!$(config.sectionSelector).length) return;

        let activeSlider = null;
        const $tabsContainer = $(config.tabsContainer);
        const categories = Object.keys(config.data);

        const createTabbedSlider = (category) => {
            if (activeSlider) {
                $(config.trackSelector).empty();
                $(config.dotsSelector).empty();
                $(`${config.nextSelector}, ${config.prevSelector}`).off('click');
            }
            
            activeSlider = createSlider({
                containerSelector: config.sliderContainer,
                data: config.data[category],
                nextSelector: config.nextSelector,
                prevSelector: config.prevSelector,
                dotsSelector: config.dotsSelector,
                recalculateOnResize: true,
                setup: config.setup,
                render: config.render
            });
        };

        categories.forEach((category, index) => {
            const $button = $('<button>', { text: category, class: config.tabClass })
                .on('click', function() {
                    $(`.${config.tabClass}`).removeClass('active');
                    $(this).addClass('active');
                    createTabbedSlider(category);
                });
            $tabsContainer.append($button);
            
            if (index === 0) {
                $button.addClass('active');
                createTabbedSlider(category);
            }
        });
    }

    
    // --- 5. Floor Plans Tabbed Slider (CORRECTED) ---
    initializeTabbedSlider({
        sectionSelector: '#floorplan-section',
        tabsContainer: '#floorplan-categories',
        tabClass: 'floorplan-category-btn',
        sliderContainer: '#floorplan-slider',
        trackSelector: '#floorplan-track',
        nextSelector: '#floorplan-next',
        prevSelector: '#floorplan-back',
        dotsSelector: '#floorplan-dots',
        data: {
            'CATEGORY 1': [
                { image: 'assets/images/image/building-1.png' }, 
                { image: 'assets/images/image/building-1.png' },
                { image: 'assets/images/image/building-1.png' }, // Example for scrolling
            ],
            'CATEGORY 2': [
                { image: 'assets/images/image/building-1.png' },
            ],
            'CATEGORY 3': [
                { image: 'assets/images/image/building-1.png' },
                { image: 'assets/images/image/building-1.png' },
            ],
            'CATEGORY 4': [
                { image: 'assets/images/image/building-1.png' },
            ]
        },
        setup: (container, data) => {
            const $track = $(container).find('#floorplan-track');
            $track.empty();
            data.forEach(plan => {
                // The card is 50% width to show two at a time
                $track.append(`<div class="floorplan-card flex-shrink-0 w-1/2 p-2"><img src="${plan.image}" class="w-full h-auto object-contain bg-white shadow-md"></div>`);
            });
        },
        render: (index, data) => {
            const $slides = $('.floorplan-card');
            if (!$slides.length) return;

            // Simple sliding logic: slide by half the track width at a time
            const slideWidth = $slides.first().outerWidth();
            let newIndex = Math.floor(index / 2) * 2; // Move in steps of 2
            if(newIndex >= data.length -1) newIndex = data.length - 2;
            if(newIndex < 0) newIndex = 0;

            const newTranslateX = newIndex * slideWidth;
            
            $('#floorplan-track').css('transform', `translateX(-${newTranslateX}px)`);
        }
    });

    // --- 6. Glimpses Gallery Tabbed Slider ---
    initializeTabbedSlider({
        sectionSelector: '#glimpses-gallery',
        tabsContainer: '#gallery-tabs',
        tabClass: 'gallery-tab-btn',
        sliderContainer: '#gallery-slider-container',
        trackSelector: '#gallery-track',
        nextSelector: '#gallery-next',
        prevSelector: '#gallery-back',
        dotsSelector: '#gallery-dots',
        data: {
            'FLAT A': [{ image: 'assets/images/image/building-1.png' }, { image: 'assets/images/image/building-1.png' }],
            'FLAT B': [{ image: 'assets/images/image/building-1.png' }],
            'FLAT C': [{ image: 'assets/images/image/building-1.png' }],
        },
         setup: (container, data) => {
            const $track = $(container).find('#gallery-track');
            $track.empty();
            data.forEach(item => {
                // CORRECTED: Added padding to the track and adjusted card widths for the peeking effect
                $track.parent().addClass('px-4 sm:px-8 md:px-12'); // Add horizontal padding to the container
                const card = `
                    <div class="gallery-card flex-shrink-0 w-full sm:w-10/12 md:w-8/12 lg:w-1/2 p-2">
                        <img src="${item.image}" alt="Gallery Image" class="w-full h-auto object-cover rounded-lg shadow-md">
                    </div>
                `;
                $track.append(card);
            });
        },
        render: (index) => {
            const $slides = $('.gallery-card');
            if (!$slides.eq(index).length) return;
            const containerWidth = $('#gallery-slider-container').width();
            const slideWidth = $slides.eq(index).outerWidth();
            const slidePosition = $slides.eq(index).position().left;
            const centerOffset = (containerWidth - slideWidth) / 2;
            $('#gallery-track').css('transform', `translateX(-${slidePosition - centerOffset}px)`);
        }
    });

    // --- RECENT PROJECTS SLIDER (Homepage - CORRECTED) ---
    const recentProjectsData = [
        { name: 'NIRMALA BAGAN', image: 'assets/images/image/building-1.png', units: '2BHK | 3BHK', price: 'Rs. 33 Lakhs Onwards', link: '#' },
        { name: 'NIRMALA VISTA', image: 'assets/images/image/Rectangle 45.png', units: '2BHK | 3BHK', price: 'Rs. 45 Lakhs Onwards', link: '#' },
        { name: 'ATREYAA', image: 'images/atreyaa.jpg', units: '3BHK | 4BHK', price: 'Rs. 1.2 Cr Onwards', link: '#' },
    ];

    createSlider({
        containerSelector: '#recent-projects-slider',
        data: recentProjectsData,
        nextSelector: '#recent-next',
        prevSelector: '#recent-prev',
        dotsSelector: '#recent-dots',
        recalculateOnResize: true,
        setup: ($container, data) => {
            const $track = $('#recent-slider-track');
            $track.empty();
            data.forEach(project => {
                // NOTE: Card width is now less than 100% to allow the next one to peek.
                const card = `
                    <div class="recent-project-card flex-shrink-0 w-11/12 sm:w-4/5 md:w-10/12 lg:w-3/4 p-2 ">
                        <a href="${project.link}" class="block relative group shadow-lg">
                            <img src="${project.image}" alt="${project.name}" class="w-full h-100 md:h-150 object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div class="absolute bottom-6 left-6 text-white">
                                <h3 class="text-2xl font-bold flex items-center">${project.name} <span class="ml-2 transition-transform duration-300 group-hover:translate-x-2">&rarr;</span></h3>
                                <p class="text-sm mt-1">${project.units} &nbsp;|&nbsp; ${project.price}</p>
                            </div>
                        </a>
                    </div>
                `;
                $track.append(card);
            });
        },
        render: (index) => {
            const $slides = $('.recent-project-card');
            if (!$slides.length) return;
            
            // Calculate position based on the start of the slide, not its width
            const slidePosition = $slides.eq(index).position().left;
            
            $('#recent-slider-track').css('transform', `translateX(-${slidePosition}px)`);
        }
    });
    // =======================================================
    // OTHER PAGE-SPECIFIC LOGIC
    // =======================================================

    // --- Mobile Menu Toggle ---
    $('#mobile-menu-btn').on('click', () => $('#mobile-menu').toggleClass('hidden'));
    $('#mobile-menu a').on('click', () => $('#mobile-menu').addClass('hidden'));

    // --- Location Benefits Tabs ---
    $('#location-tabs').on('click', '.location-tab', function() {
        const targetId = $(this).data('target');
        $('.location-tab').removeClass('active');
        $(this).addClass('active');
        $('.location-panel').addClass('hidden');
        $('#' + targetId).removeClass('hidden');
    });

    // --- Video Walk-through Modal ---
    const $videoModal = $('#video-modal');
    if ($videoModal.length) {
        const $iframe = $('#youtube-iframe');
        const closeModal = () => {
            $iframe.attr('src', '');
            $videoModal.addClass('hidden');
            $('body').removeClass('overflow-hidden');
        };

        $('#play-video-btn').on('click', function(e) {
            e.preventDefault();
            const videoId = $(this).data('video-id');
            $iframe.attr('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
            $videoModal.removeClass('hidden');
            $('body').addClass('overflow-hidden');
        });

        $('#close-modal-btn').on('click', closeModal);
        $videoModal.on('click', (e) => { if ($(e.target).is($videoModal)) closeModal(); });
        $(document).on('keydown', (e) => { if (e.key === "Escape" && !$videoModal.hasClass('hidden')) closeModal(); });
    }
});