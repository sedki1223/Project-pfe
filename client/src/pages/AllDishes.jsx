import React, { useEffect, useState, useMemo } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StarRating from '../components/StarRating';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => (
  <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked, label)}
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
    />
    <span className="font-light select-none">{label}</span>
  </label>
);

const AllDishes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currency = '$';

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFilters, setSelectedFilters] = useState({
    dishType: [],
    priceRange: [],
  });

  const [selectedSortOption, setSelectedSortOption] = useState('');
  const [openFilters, setOpenFilters] = useState(false);

  // Dish types and price ranges matching your backend data & UI needs
  const dishTypes = ['Appetizer', 'Main Course', 'Dessert', 'Breakfast'];
  const priceRanges = ['0 to 5', '5 to 10', '10 to 20', '20+'];
  const sortOptions = ['Price Low to High', 'Price High to Low', 'Newest First'];

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dishes');
        const data = await res.json();
        if (res.ok && data.success) {
          setDishes(data.dishes);
          setError(null);
        } else {
          setError(data.message || 'Failed to load dishes');
        }
      } catch (err) {
        setError('Error fetching dishes');
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (checked && !updated[type].includes(value)) {
        updated[type].push(value);
      } else if (!checked) {
        updated[type] = updated[type].filter((v) => v !== value);
      }
      return updated;
    });
  };

  const handleDishTypeChange = (checked, value) => {
    handleFilterChange(checked, value, 'dishType');
  };

  const handlePriceRangeChange = (checked, value) => {
    handleFilterChange(checked, value, 'priceRange');
  };

  const sortDishes = (a, b) => {
    if (selectedSortOption === 'Price Low to High') return a.price - b.price;
    if (selectedSortOption === 'Price High to Low') return b.price - a.price;
    if (selectedSortOption === 'Newest First') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  };

  const matchesDishType = (dish) =>
    selectedFilters.dishType.length === 0 || selectedFilters.dishType.includes(dish.category);

  const matchesPriceRange = (dish) => {
    if (selectedFilters.priceRange.length === 0) return true;

    return selectedFilters.priceRange.some((range) => {
      if (range === '20+') {
        return dish.price >= 20;
      }
      const [min, max] = range.split(' to ').map(Number);
      return dish.price >= min && dish.price <= max;
    });
  };

  const destination = searchParams.get('destination') || '';

  const filteredDishes = useMemo(() => {
    return dishes
      .filter(
        (dish) =>
          dish.isAvailable !== false && // only available dishes
          matchesDishType(dish) &&
          matchesPriceRange(dish) &&
          (dish.restaurant?.city?.toLowerCase() || '').includes(destination.toLowerCase())
      )
      .sort(sortDishes);
  }, [dishes, selectedFilters, selectedSortOption, destination]);

  const clearFilters = () => {
    setSelectedFilters({ dishType: [], priceRange: [] });
    setSelectedSortOption('');
    setSearchParams({});
  };

  if (loading) return <p className="text-center mt-20">Loading dishes...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Available Dishes</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-[700px]">
            Browse our tasty selection of dishes and find something to satisfy your cravings!
          </p>
        </div>

        {filteredDishes.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">No dishes match your criteria.</p>
        ) : (
          filteredDishes.map((dish) => (
            <div
              key={dish._id}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-32 last:border-0 cursor-pointer"
              onClick={() => {
                navigate(`/dishes/${dish._id}`);
                scrollTo(0, 0);
              }}
            >
              <img
                src={dish.images?.[0] || assets.defaultFoodImage}
                alt={dish.name}
                title="View Dish Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover"
                onError={(e) => (e.currentTarget.src = assets.defaultFoodImage)}
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{dish.restaurant?.city || 'Unknown city'}</p>
                <p className="text-gray-800 text-3xl font-playfair cursor-pointer">{dish.name}</p>
                <div className="flex items-center">
                  <StarRating rating={dish.rating || 4} />
                  <p className="ml-2">200+ reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <img src={assets.locationIcon} alt="location-icon" />
                  <span>{dish.restaurant?.address || 'No address'}</span>
                </div>
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {dish.ingredients?.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                    >
                      <img
                        src={assets.ingredientIcons?.[ingredient] || assets.defaultFoodImage}
                        alt={ingredient}
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{ingredient}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xl font-medium text-gray-700">{currency}{dish.price}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <aside className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-300">
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden">
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span onClick={clearFilters} className="hidden lg:block">
              CLEAR
            </span>
          </div>
        </div>

        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Dish Type</p>
            {dishTypes.map((type) => (
              <CheckBox
                key={type}
                label={type}
                selected={selectedFilters.dishType.includes(type)}
                onChange={handleDishTypeChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price Range</p>
            {priceRanges.map((range) => (
              <CheckBox
                key={range}
                label={range}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={handlePriceRangeChange}
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option) => (
              <RadioButton
                key={option}
                label={option}
                selected={selectedSortOption === option}
                onChange={setSelectedSortOption}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AllDishes;
