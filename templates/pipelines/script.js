let timeoutID = null;

function getMockData() {
    try {
        const response = [
            {
                "busines_name": "Text 1",
                "program_type": "Text",
                "url": "https://link.to.item/123",
            },
            {
                "busines_name": "Text 2",
                "program_type": "Text",
                "url": "https://link.to.item/123",
            },
        ];

        const $dropdownMenu = $(".dropdown-menu");
        const $dropdownToggle = $('.dropdown-toggle');

        if (!$dropdownMenu.length || !$dropdownToggle.length) {
            console.warn('Dropdown elements not found');
            return;
        }

        const options = response.map(item => {
            if (!item.url || !item.busines_name) {
                console.warn('Invalid item data:', item);
                return '';
            }
            return `<a class="dropdown-item" target="_blank" href="${item.url}">${item.busines_name}</a>`;
        }).filter(item => item !== '');

        $dropdownMenu.html(options.join(""));
        $dropdownToggle.dropdown('toggle');
    } catch (error) {
        console.error('Error in getMockData:', error);
    }
}

function getRealData(data) {
    if (!data) {
        console.warn('No data provided for getRealData');
        return;
    }

    $.ajax({
        url: "/",
        cache: false,
        dataType: "json",
        type: "POST",
        data: data,
        success: function(result) {
            try {
                if (!Array.isArray(result)) {
                    throw new Error('Invalid response format');
                }

                const $dropdownMenu = $(".dropdown-menu");
                const $dropdownToggle = $('.dropdown-toggle');

                if (!$dropdownMenu.length || !$dropdownToggle.length) {
                    throw new Error('Dropdown elements not found');
                }

                const options = result.map(item => {
                    if (!item.url || !item.busines_name) {
                        console.warn('Invalid item data:', item);
                        return '';
                    }
                    return `<a class="dropdown-item" target="_blank" rel="noopener noreferrer" href="${item.url}">${item.busines_name}</a>`;
                }).filter(item => item !== '');

                $dropdownMenu.html(options.join(""));
                $dropdownToggle.dropdown('toggle');
            } catch (error) {
                console.error('Error in success callback:', error);
            }
        },
        error: function(error) {
            try {
                const $dropdownMenu = $(".dropdown-menu");
                const $dropdownToggle = $('.dropdown-toggle');

                if (!$dropdownMenu.length || !$dropdownToggle.length) {
                    throw new Error('Dropdown elements not found');
                }

                const errorMessage = error[0]?.msg || 'Unknown error occurred';
                $dropdownMenu.html(`<span class="dropdown-item">${errorMessage}</span>`);
                $dropdownToggle.dropdown('toggle');
            } catch (err) {
                console.error('Error in error callback:', err);
            }
        }
    });
}

$(document).ready(function() {
    // Search functionality
    const $search = $("#search");
    if (!$search.length) {
        console.warn('Search element not found');
        return;
    }

    $search.keyup(function() {
        try {
            const $this = $(this);
            const $parent = $this.parent();
            
            if ($this.val().length > 0) {
                $parent.addClass("active");
                $('body').addClass("active-search");
            } else {
                $parent.removeClass("active");
                $('body').removeClass("active-search");
            }
            
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => getMockData(), 500);
        } catch (error) {
            console.error('Error in search keyup handler:', error);
        }
    });

    // Cancel button handler
    $(".cancel").click(function() {
        try {
            const $search = $("#search");
            if (!$search.length) {
                throw new Error('Search element not found');
            }
            
            $search.val("");
            $(this).parent().removeClass("active");
            $('body').removeClass("active-search");
        } catch (error) {
            console.error('Error in cancel click handler:', error);
        }
    });

    // URL parameter handling
    function getUrlParameter(sParam) {
        try {
            if (!sParam) {
                throw new Error('Parameter name is required');
            }

            const sPageURL = window.location.search.substring(1);
            const sURLVariables = sPageURL.split('&');

            for (let i = 0; i < sURLVariables.length; i++) {
                let sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
            return false;
        } catch (error) {
            console.error('Error in getUrlParameter:', error);
            return false;
        }
    }

    // Pagination handling
    try {
        const page = parseInt(getUrlParameter('page')) || 1;
        const $pageItems = $(".page-item");
        
        if (!$pageItems.length) {
            throw new Error('Pagination elements not found');
        }

        const pages = $pageItems.toArray().length - 2;

        $pageItems.removeClass("active");
        const $activePage = $pageItems.eq(page);
        if ($activePage.length) {
            $activePage.addClass("active");
        }

        // Pagination navigation
        $(".prev-link").click((e) => {
            e.preventDefault();
            if (page > 1) {
                location.href = `?page=${page-1}`;
            }
        });

        $(".next-link").click((e) => {
            e.preventDefault();
            if (page < pages) {
                location.href = `?page=${+page+1}`;
            }
        });
    } catch (error) {
        console.error('Error in pagination setup:', error);
    }

    // Date handling
    try {
        const d = new Date();
        const $currentMonth = $(".current-month");
        
        if (!$currentMonth.length) {
            throw new Error('Current month element not found');
        }

        function updateMonthDisplay(date) {
            try {
                const monthStr = date.toLocaleString('en-GB', { month: 'long' });
                const yearStr = date.getFullYear();
                $currentMonth.html(`${monthStr} ${yearStr}`);
            } catch (error) {
                console.error('Error updating month display:', error);
            }
        }

        // Initial month display
        updateMonthDisplay(d);

        // Month navigation
        $('.prev-month').click(function() {
            try {
                const past = new Date(d.setMonth(d.getMonth() - 1));
                updateMonthDisplay(past);
            } catch (error) {
                console.error('Error in prev month handler:', error);
            }
        });

        $('.next-month').click(function() {
            try {
                const future = new Date(d.setMonth(d.getMonth() + 1));
                updateMonthDisplay(future);
            } catch (error) {
                console.error('Error in next month handler:', error);
            }
        });
    } catch (error) {
        console.error('Error in date handling setup:', error);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Select all table rows within the tbody that have a 'data-href' attribute
    const rows = document.querySelectorAll('.pipeline-table tbody tr[data-href]');

    // Add a click event listener to each of these rows
    rows.forEach(row => {
        row.addEventListener('click', function() {
            // Get the URL from the 'data-href' attribute
            const url = this.dataset.href; // 'this.dataset.href' is a modern way to access 'data-href'
            // Navigate to the URL
            if (url) {
                window.location.href = url;
            }
        });

        // Optional: Make rows keyboard accessible
        // Rows are not naturally focusable, so we add tabindex
        row.setAttribute('tabindex', '0');
        // Handle Enter key press for keyboard navigation
        row.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) { // 'Enter' or keyCode 13 for older browsers
                const url = this.dataset.href;
                if (url) {
                    window.location.href = url;
                }
            }
        });
    });
});