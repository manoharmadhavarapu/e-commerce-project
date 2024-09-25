// Add a product to local storage
export const addFavoriteToLocalStorage = (product) => {
    const favorites = getFavoritesFromLocalStorage();

    if(!favorites.some((p)=>p._id === product._id)) {
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Remove product from loacl storage
export const removeFavoriteFromLocalStorage = (productId) => {
    const favorites = getFavoritesFromLocalStorage();
    const updateFavorites = favorites.filter((product) => product._id !== productId);

    localStorage.setItem('favorites', JSON.stringify(updateFavorites));
}

// Retrive favorites from local storage
export const getFavoritesFromLocalStorage = () => {
    const favoritesJSON = localStorage.getItem('favorites');
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}