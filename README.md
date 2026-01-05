# ShopEasy - E-commerce Website

A modern, responsive e-commerce website built with React.js featuring a clean UI, shopping cart functionality, and product management.

## Features

- 🛍️ **Product Catalog**: Browse products with filtering and search functionality
- 🛒 **Shopping Cart**: Add/remove items, update quantities, and manage cart state
- 💳 **Checkout Process**: Complete order flow with form validation
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- ⚡ **Fast Performance**: Built with Vite for optimal development and build performance
- 🎨 **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React
- **Styling**: Custom CSS with modern design patterns
- **Images**: Unsplash for product images

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd E-commrce
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
│   ├── ProductCard.jsx # Product display card
│   └── CartItem.jsx    # Cart item component
├── context/            # React Context for state management
│   └── CartContext.jsx # Shopping cart state
├── data/               # Static data and mock APIs
│   └── products.js     # Product data
├── pages/              # Main application pages
│   ├── Home.jsx        # Landing page
│   ├── Products.jsx    # Product listing page
│   ├── ProductDetail.jsx # Individual product page
│   ├── Cart.jsx        # Shopping cart page
│   └── Checkout.jsx    # Checkout process
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## Features Overview

### Home Page
- Hero section with call-to-action
- Featured products showcase
- Category filtering
- Newsletter subscription
- Company features highlight

### Products Page
- Product grid/list view toggle
- Search functionality
- Category filtering
- Price range filtering
- Sorting options (name, price, rating)

### Product Detail Page
- High-quality product images
- Detailed product information
- Quantity selector
- Add to cart functionality
- Related products section

### Shopping Cart
- Item management (add, remove, update quantity)
- Order summary with pricing
- Shipping calculation
- Proceed to checkout

### Checkout Process
- Contact information form
- Shipping address form
- Payment information form
- Order summary
- Order confirmation

## State Management

The application uses React Context API for state management:

- **CartContext**: Manages shopping cart state including:
  - Adding/removing items
  - Updating quantities
  - Calculating totals
  - Clearing cart

## Styling

The application uses custom CSS with:
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming
- Responsive design patterns
- Smooth animations and transitions
- Modern design principles

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Enhancements

- User authentication and accounts
- Product reviews and ratings
- Wishlist functionality
- Payment gateway integration
- Admin dashboard
- Order tracking
- Email notifications
- Product recommendations
- Multi-language support
