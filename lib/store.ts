import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Product = { id: number; name: string; category: string; price: number; oldPrice?: number; rating: number; reviews: number; image: string; description: string; badge?: string }
export type CartItem = Product & { quantity: number }

const imagePool = [
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=900&q=85',
]
const names = ['AeroBook Pro 14', 'Studio Display 27', 'Pulse Wireless Headphones', 'Arc Mechanical Keyboard', 'Orbit Smartwatch', 'Beam Portable Speaker', 'Canvas 4K Webcam', 'Flux USB-C Hub', 'Nova Gaming Monitor', 'Lumen Desk Lamp', 'Echo Noise Cancelling Buds', 'Slate Tablet 11']
const categories = ['Laptops', 'Monitors', 'Audio', 'Accessories', 'Smart Home']
export const products: Product[] = Array.from({ length: 108 }, (_, i) => ({
  id: i + 1, name: `${names[i % names.length]} ${i > 11 ? `S${(i % 4) + 1}` : ''}`.trim(), category: categories[i % categories.length], price: [1299, 899, 249, 149, 329, 179, 119, 89][i % 8], oldPrice: i % 3 === 0 ? [1499, 999, 299, 179][i % 4] : undefined, rating: Number((4.4 + (i % 6) / 10).toFixed(1)), reviews: 38 + i * 7, image: imagePool[i % imagePool.length], description: 'Thoughtfully designed technology for the way you work, create, and live.', badge: i % 5 === 0 ? 'New arrival' : i % 3 === 0 ? 'Best seller' : undefined,
}))

const saved = (key: string, fallback: any) => { if (typeof window === 'undefined') return fallback; try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) } catch { return fallback } }
const cartSlice = createSlice({ name: 'cart', initialState: [] as CartItem[], reducers: {
  add: (state, action: PayloadAction<Product>) => { const found = state.find(i => i.id === action.payload.id); found ? found.quantity++ : state.push({ ...action.payload, quantity: 1 }) },
  increment: (state, action: PayloadAction<number>) => { const item = state.find(i => i.id === action.payload); if (item) item.quantity++ },
  decrement: (state, action: PayloadAction<number>) => { const item = state.find(i => i.id === action.payload); if (item && item.quantity > 1) item.quantity--; else return state.filter(i => i.id !== action.payload) },
  remove: (state, action: PayloadAction<number>) => state.filter(i => i.id !== action.payload),
  clear: () => [],
}})
const wishlistSlice = createSlice({ name: 'wishlist', initialState: [] as number[], reducers: { toggle: (state, action: PayloadAction<number>) => state.includes(action.payload) ? state.filter(id => id !== action.payload) : [...state, action.payload] } })
const userSlice = createSlice({ name: 'user', initialState: { name: 'Alex Morgan', email: 'alex@nexora.store', addresses: ['21 Clifton Avenue, New York, NY 10011'] }, reducers: {} })
export const { add, increment, decrement, remove, clear } = cartSlice.actions
export const { toggle } = wishlistSlice.actions
export const store = configureStore({ reducer: { cart: cartSlice.reducer, wishlist: wishlistSlice.reducer, user: userSlice.reducer }, preloadedState: typeof window !== 'undefined' ? { cart: saved('nexora-cart', []), wishlist: saved('nexora-wishlist', []), user: { name: 'Alex Morgan', email: 'alex@nexora.store', addresses: ['21 Clifton Avenue, New York, NY 10011'] } } : undefined })
store.subscribe(() => { if (typeof window !== 'undefined') { localStorage.setItem('nexora-cart', JSON.stringify(store.getState().cart)); localStorage.setItem('nexora-wishlist', JSON.stringify(store.getState().wishlist)) } })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const selectCartCount = (s: RootState) => s.cart.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartTotal = (s: RootState) => s.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
export const selectWishlistProducts = (s: RootState) => products.filter(p => s.wishlist.includes(p.id))

export default store
