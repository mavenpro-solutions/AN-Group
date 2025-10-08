$(function() { // Shorthand for $(document).ready()

    // =======================================================
    // UNIVERSAL SLIDER FACTORY
    // =======================================================
    /**
     * Creates a generic, configurable slider.
     * @param {object} options - The configuration for the slider.
     * Required options:
     * - containerSelector: The main wrapper of the slider.
     * - data: An array of slide data objects.
     * - render: A function(index, data) that defines how to display a slide.
     * Optional options:
     * - nextSelector, prevSelector, dotsSelector: Selectors for navigation.
     * - setup: A function(container, data) that runs once to build initial HTML.
     */
    function createSlider(options) {
        // Don't run if the slider's main container isn't on the current page
        const $container = $(options.containerSelector);
        if (!$container.length) {
            return;
        }

        let currentIndex = 0;
        const totalSlides = options.data.length;
        const $dotsContainer = $(options.dotsSelector);

        // Run the one-time setup function if it exists
        if (options.setup) {
            options.setup($container, options.data);
        }

        // --- Core Render Function ---
        const render = (index) => {
            options.render(index, options.data);
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

        // --- Dots Generation ---
        if ($dotsContainer.length) {
            for (let i = 0; i < totalSlides; i++) {
                const dot = $('<span>').addClass('dot').on('click', function() {
                    currentIndex = i;
                    render(currentIndex);
                });
                $dotsContainer.append(dot);
            }
        }

        // --- Initial Render ---
        render(currentIndex);

        // --- Recalculate on Resize (for transform-based sliders) ---
        if (options.recalculateOnResize) {
            $(window).on('resize', () => setTimeout(() => render(currentIndex), 200));
        }
    }


    // =======================================================
    // SLIDER CONFIGURATIONS
    // =======================================================

    // --- 1. Ongoing Projects Slider (Homepage) ---
    const projects = [
        { name: 'ATREYAA', image: 'assets/images/image/Rectangle 41.png', link: '#' },
        { name: 'NIRMALA', image: 'assets/images/image/Rectangle 41.png', link: '#' },
        { name: 'VISTA', image: 'assets/images/image/Rectangle 41.png', link: '#' },
        { name: 'HERITAGE', image: 'assets/images/image/Rectangle 41.png', link: '#' }
    ];

    createSlider({
        containerSelector: '#ongoing-projects-slider', // Add this ID to the section in your HTML
        data: projects,
        nextSelector: '#project-next',
        prevSelector: '#project-prev',
        dotsSelector: '#project-dots',
        setup: ($container, data) => {
            data.forEach((p, i) => {
                $('<img>', {
                    src: p.image, alt: p.name,
                    class: `absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i !== 0 ? 'opacity-0' : ''}`
                }).appendTo($container.find('#slider-container'));
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
    const testimonials = [
        { name: 'Amit Agarwal', text: '...', image: 'assets/images/image/Rectangle 47.png', avatar: 'assets/images/image/Ellipse 6.png' },
        { name: 'Priya Singh', text: '...', image: 'assets/images/image/Rectangle 47.png', avatar: 'assets/images/image/Ellipse 7.png' },
        { name: 'Rahul Kumar', text: '...', image: 'assets/images/image/Rectangle 47.png', avatar: 'assets/images/image/Ellipse 8.png' },
        { name: 'Sunita Sharma', text: '...', image: 'assets/images/image/Rectangle 47.png', avatar: 'assets/images/image/Ellipse 9.png' }
    ];

    createSlider({
        containerSelector: '#testimonial-slider', // Add this ID to the section in your HTML
        data: testimonials,
        nextSelector: '#testimonial-next',
        prevSelector: '#testimonial-back',
        dotsSelector: '#testimonial-dots',
        setup: ($container, data) => {
            const $avatars = $('#testimonial-avatars');
            data.forEach((t, i) => {
                $('<img>', { src: t.avatar, class: 'avatar' })
                    .on('click', () => { /* Link to render function is handled by the main factory */ })
                    .appendTo($avatars);
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

    
   // --- 3. Master Plan Slider (Project Page) ---
const masterPlans = [
    { image: 'assets/images/image/building-1.png', description: 'AN Group redefines urban living in Kolkata. Since 2006, we\'ve been creating elegant 2, 3 & 4 BHK residences that blend thoughtful design, comfort, and lifestyle—crafted for those who seek more than just a home.' },
    { image: 'images/master-plan-2.jpg', description: 'This is the second floor plan, showcasing the spacious living areas and modern kitchen layout. Every detail is designed for a premium living experience.' },
    { image: 'images/master-plan-3.jpg', description: 'The third master plan highlights the connectivity between indoor and outdoor spaces, featuring a large terrace and garden access.' }
];

createSlider({
    containerSelector: '#masterplan-slider', // This ID matches the HTML section
    data: masterPlans,
    nextSelector: '#masterplan-next',
    prevSelector: '#masterplan-back',
    dotsSelector: '#masterplan-dots',
    setup: ($container, data) => {
        data.forEach((plan, i) => {
            $('<img>', {
                src: plan.image, alt: `Master Plan ${i + 1}`,
                class: `absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${i !== 0 ? 'opacity-0' : ''}`
            }).appendTo($container.find('#masterplan-slider-container'));
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

    
    // --- 4. Floor Plans Slider (Project Page) ---
    const floorPlansData = {
        'Category 1': [ // Category Name
            { image: 'assets/images/image/building-1.png' }, // Image for this category
            { image: 'assets/images/image/building-1.png' },
        ],
        'Category 2': [
            { image: 'assets/images/image/building-1.png' },
        ],
        'Category 3': [
            { image: 'assets/images/image/building-1.png' },
            { image: 'assets/images/image/building-1.png' },
            { image: 'assets/images/image/building-1.png' },
        ],
        'Category 4': [
            { image: 'assets/images/image/building-1.png' },
        ]
    };

    if ($('#floorplan-section').length) {
        let activeSlider = null;
        const $categoriesContainer = $('#floorplan-categories');
        const categories = Object.keys(floorPlansData);

        const createFloorPlanSlider = (category) => {
            // Clear previous slider's HTML and events
            if (activeSlider) {
                $('#floorplan-track').empty();
                $('#floorplan-dots').empty();
                $('#floorplan-next, #floorplan-back').off('click');
            }
            
            // Create a new slider instance for the selected category
            activeSlider = createSlider({
                containerSelector: '#floorplan-slider',
                data: floorPlansData[category],
                nextSelector: '#floorplan-next',
                prevSelector: '#floorplan-back',
                dotsSelector: '#floorplan-dots',
                recalculateOnResize: true,
                setup: ($container, data) => {
                    const $track = $('#floorplan-track');
                    data.forEach(plan => {
                        const card = `
                            <div class="floorplan-card flex-shrink-0 w-full sm:w-1/2 px-2">
                                <img src="${plan.image}" alt="Floor Plan" class="w-full h-auto object-contain">
                            </div>
                        `;
                        $track.append(card);
                    });
                },
                render: (index) => {
                    const $slides = $('.floorplan-card');
                    if (!$slides.eq(index).length) return;
                    
                    const containerWidth = $('#floorplan-slider').width();
                    const slideWidth = $slides.eq(index).outerWidth(true); // include margin
                    const trackPosition = $slides.eq(index).position().left;
                    
                    // Adjust to center the group of visible slides
                    const centerOffset = (containerWidth / 2) - (slideWidth / 2);
                    let newTranslateX = trackPosition - centerOffset;

                    $('#floorplan-track').css('transform', `translateX(-${newTranslateX}px)`);
                }
            });
        };

        // Generate category buttons
        categories.forEach((category, index) => {
            const $button = $('<button>', {
                text: category,
                class: 'floorplan-category-btn block w-full text-left p-4 text-lg font-semibold'
            }).on('click', function() {
                // Update active button style
                $('.floorplan-category-btn').removeClass('active');
                $(this).addClass('active');
                // Create/re-create the slider for this category
                createFloorPlanSlider(category);
            });
            $categoriesContainer.append($button);
            
            // Activate the first category by default
            if (index === 0) {
                $button.addClass('active');
                createFloorPlanSlider(category);
            }
        });
    }


     // --- 5. Glimpses Gallery Slider (Project Page) ---
    const galleryData = {
        'FLAT A': [
            { image: 'assets/images/image/Rectangle 44.png' },
            { image: 'assets/images/image/Rectangle 44.png' },
            { image: 'assets/images/image/Rectangle 44.png' },
        ],
        'FLAT B': [
            { image: 'assets/images/image/Rectangle 44.png' },
            { image: 'assets/images/image/Rectangle 44.png' },
        ],
        'FLAT C': [
            { image: 'assets/images/image/Rectangle 44.png' },
        ]
    };

    if ($('#glimpses-gallery').length) {
        let activeGallerySlider = null;
        const $tabsContainer = $('#gallery-tabs');
        const categories = Object.keys(galleryData);

        const createGallerySlider = (category) => {
            // Clear previous slider state
            if (activeGallerySlider) {
                $('#gallery-track').empty();
                $('#gallery-dots').empty();
                $('#gallery-next, #gallery-back').off('click');
            }
            
            // Initialize the new slider for the selected category
            activeGallerySlider = createSlider({
                containerSelector: '#gallery-slider-container',
                data: galleryData[category],
                nextSelector: '#gallery-next',
                prevSelector: '#gallery-back',
                dotsSelector: '#gallery-dots',
                recalculateOnResize: true,
                setup: ($container, data) => {
                    const $track = $('#gallery-track');
                    data.forEach(item => {
                        const card = `
                            <div class="gallery-card flex-shrink-0 w-4/5 md:w-3/5 lg:w-2/5 p-2">
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
                    const newTranslateX = slidePosition - centerOffset;

                    $('#gallery-track').css('transform', `translateX(-${newTranslateX}px)`);
                }
            });
        };

        // Generate category tab buttons
        categories.forEach((category, index) => {
            const $button = $('<button>', {
                text: category,
                class: 'gallery-tab-btn font-semibold py-2 px-6 rounded-md'
            }).on('click', function() {
                $('.gallery-tab-btn').removeClass('active');
                $(this).addClass('active');
                createGallerySlider(category);
            });
            $tabsContainer.append($button);
            
            // Activate the first tab by default
            if (index === 0) {
                $button.addClass('active');
                createGallerySlider(category);
            }
        });
    }


    // --- 6. Amenities Slider (Project Page) ---
    const amenitiesData = [
        { name: 'Card Room', image: 'assets/images/image/building-1.png' },
        { name: 'Gymnasium', image: 'assets/images/image/building-1.png' },
        { name: 'Lift Lobby', image: 'assets/images/image/building-1.png' },
        { name: 'Rooftop Garden', image: 'assets/images/image/building-1.png' }, // Example of another amenity
        { name: 'Community Hall', image: 'assets/images/image/building-1.png' }, // Example of another amenity
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
            data.forEach(item => {
                const card = `
                    <div class="amenity-card flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4">
                        <div class="text-center">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-auto object-cover rounded-lg shadow-md mb-4">
                            <h3 class="text-xl font-semibold text-black">${item.name}</h3>
                        </div>
                    </div>
                `;
                $track.append(card);
            });
        },
        render: (index) => {
            const $slides = $('.amenity-card');
            if (!$slides.length) return;

            // Get the width of one slide
            const slideWidth = $slides.first().outerWidth();
            
            // Calculate the translation value
            const newTranslateX = index * slideWidth;

            $('#amenities-track').css('transform', `translateX(-${newTranslateX}px)`);
        }
    });


    // --- Location Benefits Tabs ---
    if ($('#location-tabs').length) {
        $('.location-tab').on('click', function() {
            const targetId = $(this).data('target');

            // Update button active state
            $('.location-tab').removeClass('active');
            $(this).addClass('active');

            // Hide all panels, then show the target panel
            $('.location-panel').addClass('hidden');
            $('#' + targetId).removeClass('hidden');
        });
    }
    // =======================================================
    // OTHER PAGE-SPECIFIC LOGIC
    // =======================================================

    // --- Mobile Menu Toggle ---
    $('#mobile-menu-btn').on('click', function() {
        $('#mobile-menu').toggleClass('hidden');
    });
    $('#mobile-menu a').on('click', function() {
        $('#mobile-menu').addClass('hidden');
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
        $(document).on('keydown', (e) => { if (e.key === "Escape") closeModal(); });
    }
});