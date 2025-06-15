import React, { useMemo, useState } from 'react';
import { assets, dishesDummyData } from '../assets/assets'; // your updated dishesDummyData here
import { useNavigate, useSearchParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useAppContext } from '@/context/AppContext';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
      aria-checked={selected}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const RadioButton = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="radio"
      name="sortOption"
      checked={selected}
      onChange={() => onChange(label)}
      aria-checked={selected}
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const AllFoods = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currency = '$' } = useAppContext(); // fallback to $ if not provided

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    dishType: [],
    priceRange: [],
  });
  const [selectedSortOption, setSelectedSortOption] = useState('');

  // Updated dish types from your data
  const dishTypes = ['Appetizer', 'Main Course', 'Dessert', 'Breakfast'];

  // Price ranges - matches pricePerServing range
  const priceRanges = [`${currency} 0 to 5`, `${currency} 5 to 10`, `${currency} 10 to 20`, `${currency} 20+`];

  const sortOptions = ['Price Low to High', 'Price High to Low', 'Newest First'];

  // Helper to update filters
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (checked && !updated[type].includes(value)) updated[type].push(value);
      else updated[type] = updated[type].filter((item) => item !== value);
      return updated;
    });
  };

  const handleDishTypeChange = (checked, value) => {
    handleFilterChange(checked, value, 'dishType');
  };

  const handlePriceRangeChange = (checked, value) => {
    handleFilterChange(checked, value, 'priceRange');
  };

  const handleSortChange = (option) => setSelectedSortOption(option);

  // Filtering helpers
  const matchesDishType = (dish) =>
    selectedFilters.dishType.length === 0 || selectedFilters.dishType.includes(dish.dishType);

  const matchesPriceRange = (dish) =>
    selectedFilters.priceRange.length === 0 ||
    selectedFilters.priceRange.some((rangeWithCurrency) => {
      // Remove currency sign before splitting
      const range = rangeWithCurrency.replace(`${currency} `, '');
      if (range.endsWith('+')) {
        const min = Number(range.replace('+', ''));
        return dish.pricePerServing >= min;
      }
      const [min, max] = range.split(' to ').map(Number);
      return dish.pricePerServing >= min && dish.pricePerServing <= max;
    });

  // Sorting function
  const sortDishes = (a, b) => {
    if (selectedSortOption === 'Price Low to High') return a.pricePerServing - b.pricePerServing;
    if (selectedSortOption === 'Price High to Low') return b.pricePerServing - a.pricePerServing;
    if (selectedSortOption === 'Newest First') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  };

  // Filter by destination query param (restaurant city)
  const destination = searchParams.get('destination') || '';

  // Memoized filtered and sorted dishes list
  const filteredFoods = useMemo(() => {
    return dishesDummyData
      .filter(
        (dish) =>
          dish.isAvailable && // only available dishes
          matchesDishType(dish) &&
          matchesPriceRange(dish) &&
          (dish.restaurant?.city?.toLowerCase() || '').includes(destination.toLowerCase())
      )
      .sort(sortDishes);
  }, [selectedFilters, selectedSortOption, destination, currency]);

  const clearFilters = () => {
    setSelectedFilters({ dishType: [], priceRange: [] });
    setSelectedSortOption('');
    setSearchParams({});
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Dish List */}
      <div className="flex-1">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Available Dishes</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-[700px]">
            Browse our tasty selection of dishes and find something to satisfy your cravings!
          </p>
        </div>

        {filteredFoods.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">No dishes match your criteria.</p>
        ) : (
          filteredFoods.map((dish) => (
            <div
              key={dish._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-32 last:border-0 cursor-pointer"
              onClick={() => {
                navigate(`/foods/${dish._id}`);
                scrollTo(0, 0);
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/foods/${dish._id}`);
                  scrollTo(0, 0);
                }
              }}
            >
              <img
                src={dish.images?.[0] || assets.defaultFoodImage}
                alt={dish.name}
                className="max-h-[260px] md:w-1/2 rounded-xl shadow-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = assets.defaultFoodImage;
                }}
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{dish.restaurant?.city}</p>
                <p className="text-gray-800 text-3xl font-playfair">{dish.name}</p>
                <div className="flex items-center">
                  <StarRating rating={dish.rating || 4} /> {/* fallback to 4 stars if rating missing */}
                  <p className="ml-2">200+ reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{dish.restaurant?.address}</span>
                </div>
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {dish.ingredients?.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      <img src={assets.ingredientIcons?.[ingredient]} alt={ingredient} className="w-5 h-5" />
                      <p className="text-xs">{ingredient}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xl font-medium text-gray-700">
                  {currency} {dish.pricePerServing}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-300">
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden">
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span
              onClick={clearFilters}
              className="hidden lg:inline-block text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Clear all
            </span>
          </div>
        </div>

        {openFilters && (
          <div className="p-5 space-y-4">
            {/* Dish Type Filter */}
            <div>
              <p className="font-semibold mb-1 text-gray-700">Dish Type</p>
              {dishTypes.map((type) => (
                <CheckBox
                  key={type}
                  label={type}
                  selected={selectedFilters.dishType.includes(type)}
                  onChange={handleDishTypeChange}
                />
              ))}
            </div>

            {/* Price Range Filter */}
            <div>
              <p className="font-semibold mb-1 text-gray-700">Price Range</p>
              {priceRanges.map((range) => (
                <CheckBox
                  key={range}
                  label={range}
                  selected={selectedFilters.priceRange.includes(range)}
                  onChange={handlePriceRangeChange}
                />
              ))}
            </div>

            {/* Sorting */}
            <div>
              <p className="font-semibold mb-1 text-gray-700">Sort By</p>
              {sortOptions.map((option) => (
                <RadioButton
                  key={option}
                  label={option}
                  selected={selectedSortOption === option}
                  onChange={handleSortChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFoods;
