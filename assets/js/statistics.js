/**
 * Statistics Page - Chart.js Implementation
 * BetterSJDM Portal - San Jose del Monte City
 * Version: 2.1.0 - Updated: 2026-01-01
 */

// Site branding color palette for charts
const CHART_COLORS = {
    primary: '#0032a0',
    primaryDark: '#002170',
    accent: '#F77F00',
    success: '#06A77D',
    danger: '#D62828',
    info: '#0077BE',
    secondary: '#003D82'
};

/**
 * Get chart color palette matching site branding
 * @param {number} count - Number of colors needed
 * @returns {Array} Array of color strings
 */
function getChartColors(count) {
    const palette = [
        CHART_COLORS.primary,
        CHART_COLORS.accent,
        CHART_COLORS.success,
        CHART_COLORS.info,
        CHART_COLORS.danger,
        CHART_COLORS.secondary,
        CHART_COLORS.primaryDark,
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#14B8A6', // teal
        '#F59E0B', // amber
        '#6366F1'  // indigo
    ];

    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(palette[i % palette.length]);
    }
    return colors;
}

// Barangay population data (2020 Census) - San Jose del Monte City, Bulacan
// Source: PSA (Philippine Statistics Authority) - 2020 Census
// Note: SJDM has 62 barangays total; showing top 20 by population for visualization
const barangayData = [
    { name: 'Muzon East', population: 127506, classification: 'Urban', district: 'First' },
    { name: 'Gaya-Gaya', population: 56896, classification: 'Urban', district: 'First' },
    { name: 'Santo Cristo', population: 49579, classification: 'Urban', district: 'First' },
    { name: 'Minuyan Proper', population: 46171, classification: 'Urban', district: 'Second' },
    { name: 'Kaypian', population: 46045, classification: 'Urban', district: 'First' },
    { name: 'Graceville', population: 42207, classification: 'Urban', district: 'First' },
    { name: 'Citrus', population: 22893, classification: 'Urban', district: 'Second' },
    { name: 'San Pedro', population: 16439, classification: 'Urban', district: 'Second' },
    { name: 'Tungkong Mangga', population: 16324, classification: 'Urban', district: 'First' },
    { name: 'Francisco Homes-Mulawin', population: 11226, classification: 'Urban', district: 'First' },
    { name: 'San Manuel', population: 11432, classification: 'Urban', district: 'First' },
    { name: 'Dulong Bayan', population: 11008, classification: 'Urban', district: 'First' },
    { name: 'Gumaoc West', population: 8885, classification: 'Urban', district: 'First' },
    { name: 'Francisco Homes-Narra', population: 8293, classification: 'Urban', district: 'First' },
    { name: 'San Rafael II', population: 8139, classification: 'Urban', district: 'Second' },
    { name: 'Bagong Buhay I', population: 7264, classification: 'Urban', district: 'Second' },
    { name: 'Francisco Homes-Guijo', population: 6972, classification: 'Urban', district: 'First' },
    { name: 'San Rafael IV', population: 6447, classification: 'Urban', district: 'Second' },
    { name: 'Minuyan II', population: 5977, classification: 'Urban', district: 'Second' },
    { name: 'Sapang Palay Proper', population: 5804, classification: 'Urban', district: 'Second' }
    // Note: 42 additional barangays not shown in charts for readability
    // Total city population: 651,813 (2020 Census), 685,688 (2024 Census)
];

// Historical population data (Census years) - San Jose del Monte City
// Source: PSA (Philippine Statistics Authority)
const historicalData = {
    years: [1990, 1995, 2000, 2007, 2010, 2015, 2020, 2024],
    populations: [142047, 201394, 315807, 439090, 454553, 574089, 651813, 685688]
};

// Economic indicators data - San Jose del Monte City, Bulacan
const economicData = {
    registeredBusinesses: 1200, // Estimated
    agriculturalLand: 8500, // hectares (estimated)
    incomeClass: '1st Class City',
    cityStatus: 'Component City',
    landArea: 105.47, // km²
    barangayCount: 62,
    population2020: 651813,
    population2024: 685688,
    province: 'Bulacan',
    region: 'Central Luzon (Region III)',
    cityhoodYear: 2000
};

// Chart instances storage
let chartInstances = {};

/**
 * Create population by barangay bar chart
 * @param {string} canvasId - Canvas element ID
 * @returns {Chart} Chart.js instance
 */
function createPopulationBarChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return null;
    }

    // Sort by population (highest to lowest)
    const sortedData = [...barangayData].sort((a, b) => b.population - a.population);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(d => d.name),
            datasets: [{
                label: 'Population',
                data: sortedData.map(d => d.population),
                backgroundColor: CHART_COLORS.primary,
                borderColor: CHART_COLORS.primaryDark,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Population: ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            },
            onHover: (event, elements) => {
                event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
            }
        }
    });

    chartInstances[canvasId] = chart;
    return chart;
}

/**
 * Create historical population line chart
 * @param {string} canvasId - Canvas element ID
 * @returns {Chart} Chart.js instance
 */
function createHistoricalLineChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return null;
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.years,
            datasets: [{
                label: 'Population',
                data: historicalData.populations,
                borderColor: CHART_COLORS.primary,
                backgroundColor: 'rgba(0, 50, 160, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: CHART_COLORS.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Population: ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    chartInstances[canvasId] = chart;
    return chart;
}

/**
 * Create population distribution pie chart
 * @param {string} canvasId - Canvas element ID
 * @returns {Chart} Chart.js instance
 */
function createDistributionPieChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas element ${canvasId} not found`);
        return null;
    }

    // Get top 10 barangays by population
    const top10 = [...barangayData]
        .sort((a, b) => b.population - a.population)
        .slice(0, 10);

    const totalPopulation = barangayData.reduce((sum, b) => sum + b.population, 0);
    const colors = getChartColors(10);

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: top10.map(d => d.name),
            datasets: [{
                data: top10.map(d => d.population),
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.raw / totalPopulation) * 100).toFixed(1);
                            return `${context.label}: ${context.raw.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    chartInstances[canvasId] = chart;
    return chart;
}



/**
 * Show loading indicator for a chart container
 * @param {string} containerId - Container element ID
 */
function showChartLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.classList.add('chart-loading');
    }
}

/**
 * Hide loading indicator for a chart container
 * @param {string} containerId - Container element ID
 */
function hideChartLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.classList.remove('chart-loading');
    }
}

/**
 * Initialize all charts on the statistics page
 */
function initializeCharts() {
    // Population by Barangay chart
    if (document.getElementById('populationBarChart')) {
        showChartLoading('populationChartContainer');
        createPopulationBarChart('populationBarChart');
        hideChartLoading('populationChartContainer');
    }

    // Historical Population chart
    if (document.getElementById('historicalLineChart')) {
        showChartLoading('historicalChartContainer');
        createHistoricalLineChart('historicalLineChart');
        hideChartLoading('historicalChartContainer');
    }

    // Population Distribution chart
    if (document.getElementById('distributionPieChart')) {
        showChartLoading('distributionChartContainer');
        createDistributionPieChart('distributionPieChart');
        hideChartLoading('distributionChartContainer');
    }

}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCharts);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getChartColors,
        barangayData,
        historicalData,
        economicData,
        createPopulationBarChart,
        createHistoricalLineChart,
        createDistributionPieChart,
        initializeCharts,
        CHART_COLORS
    };
}
